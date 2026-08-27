import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CalculatorInputs, SavedRecord } from './types';
import { DEFAULT_INPUTS, calculateProfit } from './utils/calculator';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { ProductInputForm } from './components/ProductInputForm';
import { ProfitChart } from './components/ProfitChart';
import { ProfitSettlement } from './components/ProfitSettlement';
import { ShippingCalculator } from './components/ShippingCalculator';
import { ReversePricingModal } from './components/ReversePricingModal';
import { SensitivityModal } from './components/SensitivityModal';
import { HistoryDrawer } from './components/HistoryDrawer';

const STORAGE_KEY = 'shopee_br_pricing_history';

export default function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [isReversePricingOpen, setIsReversePricingOpen] = useState(false);
  const [isSensitivityOpen, setIsSensitivityOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [savedRecords, setSavedRecords] = useState<SavedRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save records to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRecords));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  }, [savedRecords]);

  // Handle single input field update
  const handleInputChange = (key: keyof CalculatorInputs, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Quick preset loading
  const handleQuickPreset = (presetName: string) => {
    if (presetName === 'standard') {
      setInputs({
        productName: '标准跨境常规款',
        priceBRL: 50,
        priceCNY: 65,
        purchaseCost: 10,
        laborCost: 3.25,
        packagingCost: 1,
        managementCost: 5.2,
        platformRate: 20,
        returnRate: 0,
        affiliateRate: 10,
        adCost: 0,
        exchangeRate: 1.3,
      });
    }
  };

  // Reset: only reset priceBRL, priceCNY, and purchaseCost to 0, keeping other custom costs & parameters unchanged
  const handleReset = () => {
    setInputs((prev) => ({
      ...prev,
      priceBRL: 0,
      priceCNY: 0,
      purchaseCost: 0,
    }));
  };

  // Save current calculation
  const handleSaveCurrent = () => {
    const results = calculateProfit(inputs);
    const newRecord: SavedRecord = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      inputs: { ...inputs },
      results,
    };
    setSavedRecords((prev) => [newRecord, ...prev]);

    // Trigger subtle confetti
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }
  };

  // Delete single record
  const handleDeleteRecord = (id: string) => {
    setSavedRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // Clear all saved records
  const handleClearAllHistory = () => {
    setSavedRecords([]);
  };

  // Load a record
  const handleLoadRecord = (record: SavedRecord) => {
    setInputs(record.inputs);
  };

  // Calculate live results
  const results = calculateProfit(inputs);

  return (
    <div className="min-h-screen bg-[#F7F7F7] geometric-grid-bg p-3 md:p-6 lg:p-8 text-[#1A1A1A] antialiased">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <Header
          onReset={handleReset}
          onOpenReversePricing={() => setIsReversePricingOpen(true)}
          onOpenSensitivity={() => setIsSensitivityOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onSaveCurrent={handleSaveCurrent}
          inputs={inputs}
          results={results}
          savedCount={savedRecords.length}
        />

        {/* 4 Summary Cards on Top */}
        <SummaryCards results={results} inputs={inputs} />

        {/* Main 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Column: 产品信息输入 */}
          <div className="lg:col-span-4 xl:col-span-4">
            <ProductInputForm
              inputs={inputs}
              onChange={handleInputChange}
              onQuickPreset={handleQuickPreset}
            />
          </div>

          {/* Middle Column: 利润构成图 */}
          <div className="lg:col-span-4 xl:col-span-4">
            <ProfitChart results={results} />
          </div>

          {/* Right Column: 核心利润结算 */}
          <div className="lg:col-span-4 xl:col-span-4">
            <ProfitSettlement results={results} inputs={inputs} />
          </div>
        </div>

        {/* Bottom Row: 头程智能算价台 */}
        <ShippingCalculator />
      </div>

      {/* Modals & Drawers */}
      <ReversePricingModal
        isOpen={isReversePricingOpen}
        onClose={() => setIsReversePricingOpen(false)}
        inputs={inputs}
        onApplyPrice={(priceBRL, priceCNY) => {
          setInputs((prev) => ({
            ...prev,
            priceBRL,
            priceCNY,
          }));
        }}
      />

      <SensitivityModal
        isOpen={isSensitivityOpen}
        onClose={() => setIsSensitivityOpen(false)}
        inputs={inputs}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        records={savedRecords}
        onLoadRecord={handleLoadRecord}
        onDeleteRecord={handleDeleteRecord}
        onClearAll={handleClearAllHistory}
      />
    </div>
  );
}
