import React, { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { CalculatorInputs } from '../types';
import { calculateReversePricing } from '../utils/calculator';

interface ReversePricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: CalculatorInputs;
  onApplyPrice: (priceBRL: number, priceCNY: number) => void;
}

export const ReversePricingModal: React.FC<ReversePricingModalProps> = ({
  isOpen,
  onClose,
  inputs,
  onApplyPrice,
}) => {
  const [targetMargin, setTargetMargin] = useState<number>(30); // 30% default target margin

  if (!isOpen) return null;

  const result = calculateReversePricing(targetMargin, inputs);

  const handleApply = () => {
    if (result.feasible && result.priceBRL > 0) {
      onApplyPrice(result.priceBRL, result.priceCNY);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl border border-[#D5D5D5] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#E5E5E5] flex items-center justify-between bg-[#FAFAFA]">
          <div className="flex items-center gap-2.5 text-[#111]">
            <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#111] tracking-tight">目标净利率 · 反向推算巴西售价</h3>
              <p className="text-[11px] text-[#777] mt-0.5">根据期望利润率自动反推最优上架售价</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#666] hover:text-black p-1 rounded-md hover:bg-[#EFEFEF] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#333] mb-1.5">
              期望达到的最终实得净利率 (%)
            </label>
            <div className="flex items-center gap-2.5">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="1"
                  max="80"
                  step="1"
                  value={targetMargin}
                  onChange={(e) => setTargetMargin(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#FAFAFA] hover:bg-white focus:bg-white border border-[#CCC] focus:border-black focus:ring-1 focus:ring-black rounded-md px-3 py-1.5 text-base font-bold text-[#111] transition-all outline-hidden"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#666]">
                  %
                </span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {[15, 20, 25, 30, 40].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTargetMargin(val)}
                    className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer transition-colors border ${
                      targetMargin === val
                        ? 'bg-black text-white border-black'
                        : 'bg-[#FAFAFA] border-[#CCC] text-[#333] hover:border-black hover:text-black hover:bg-[#EAEAEA]'
                    }`}
                  >
                    {val}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Cost Summary */}
          <div className="bg-[#FAFAFA] rounded-md p-3 text-xs text-[#555] space-y-1.5 border border-[#E0E0E0]">
            <div className="flex justify-between">
              <span>采购 + 打包 + 包材 + 平台佣金:</span>
              <span className="font-bold text-[#111]">
                ¥{(inputs.purchaseCost + inputs.laborCost + inputs.packagingCost + inputs.managementCost).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>单单直通车广告投放花费:</span>
              <span className="font-bold text-[#111]">¥{(inputs.adCost || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>扣点比例合计 (平台 {inputs.platformRate}% + 达人 {inputs.affiliateRate}%):</span>
              <span className="font-bold text-[#111]">
                {inputs.platformRate + inputs.affiliateRate}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>当前兑换汇率 (1雷亚尔折算):</span>
              <span className="font-bold text-[#111]">
                1 雷亚尔 = {inputs.exchangeRate} 人民币
              </span>
            </div>
          </div>

          {/* Calculated Output */}
          {result.feasible ? (
            <div className="bg-black text-white rounded-md p-4 text-center shadow-xs">
              <div className="text-[11px] text-[#CCC] mb-0.5">
                推荐巴西站上架售价
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white my-1.5 tracking-tight">
                R$ {result.priceBRL.toFixed(2)}
              </div>
              <div className="text-xs text-[#DDD]">
                折合人民币 <b className="text-white font-bold">¥{result.priceCNY.toFixed(2)}</b> (预计净利率约 {targetMargin}%)
              </div>
            </div>
          ) : (
            <div className="bg-[#FFF5F5] border border-red-200 rounded-md p-3 text-xs text-red-600 text-center font-medium">
              无法在现有成本扣点结构下实现 {targetMargin}% 净利率，请调低目标净利率或降低采购/营销成本。
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#FAFAFA] border-t border-[#E5E5E5] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-md text-xs font-semibold text-[#666] hover:text-black hover:bg-[#EFEFEF] transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            disabled={!result.feasible}
            onClick={handleApply}
            className="px-4 py-1.5 rounded-md text-xs font-bold bg-black hover:bg-neutral-800 text-white transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>应用到计价表</span>
          </button>
        </div>
      </div>
    </div>
  );
};

