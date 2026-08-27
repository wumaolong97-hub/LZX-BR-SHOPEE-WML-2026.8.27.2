import React from 'react';
import { Pencil, Info, RefreshCw } from 'lucide-react';
import { CalculatorInputs } from '../types';

interface ProductInputFormProps {
  inputs: CalculatorInputs;
  onChange: (key: keyof CalculatorInputs, value: any) => void;
  onQuickPreset: (presetName: string) => void;
}

export const ProductInputForm: React.FC<ProductInputFormProps> = ({
  inputs,
  onChange,
  onQuickPreset,
}) => {
  // Handle price BRL change and sync CNY
  const handlePriceBRLChange = (val: number) => {
    onChange('priceBRL', val);
    const newCNY = Number((val * (inputs.exchangeRate || 1.3)).toFixed(2));
    onChange('priceCNY', newCNY);
  };

  // Handle price CNY change and sync BRL
  const handlePriceCNYChange = (val: number) => {
    onChange('priceCNY', val);
    const newBRL = inputs.exchangeRate > 0 ? Number((val / inputs.exchangeRate).toFixed(2)) : 0;
    onChange('priceBRL', newBRL);
  };

  // Handle exchange rate change
  const handleExchangeRateChange = (val: number) => {
    onChange('exchangeRate', val);
    if (inputs.priceBRL > 0) {
      const newCNY = Number((inputs.priceBRL * val).toFixed(2));
      onChange('priceCNY', newCNY);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 md:p-5 border border-[#D5D5D5] shadow-xs h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-black bg-[#EFEFEF] px-1.5 py-0.5 rounded-sm border border-[#CCC]">
              01
            </span>
            <div>
              <h2 className="text-sm md:text-base font-bold text-[#111] tracking-tight">
                产品成本与基础参数
              </h2>
              <span className="text-[11px] text-[#777] block mt-0.5">
                实时录入与双向汇率换算
              </span>
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onQuickPreset('standard')}
              className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#222] border border-[#CCC] hover:border-black transition-colors cursor-pointer"
            >
              标准常规款
            </button>
          </div>
        </div>

        {/* Input Fields Grid */}
        <div className="space-y-3">
          {/* 产品名称 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#333]">
                商品名称与规格型号
              </label>
            </div>
            <input
              type="text"
              value={inputs.productName}
              onChange={(e) => onChange('productName', e.target.value)}
              placeholder="输入产品名称 (例如: 巴西热销女装连衣裙 / 蓝牙降噪耳机)"
              className="w-full bg-[#FAFAFA] hover:bg-white focus:bg-white border border-[#CCC] focus:border-black focus:ring-1 focus:ring-black rounded-md px-3 py-1.5 text-xs md:text-sm font-medium text-[#111] placeholder-[#888] transition-all outline-hidden"
            />
          </div>

          {/* Row 1: 售价 (雷亚尔) & 售价 (人民币) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#333]">
                  巴西站上架售价 (雷亚尔 R$)
                </label>
                <span className="text-[10px] text-[#888]">
                  ¥ = R$ × 汇率
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={inputs.priceBRL === 0 ? '' : inputs.priceBRL}
                  onChange={(e) => handlePriceBRLChange(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#FAFAFA] hover:bg-white focus:bg-white border border-[#CCC] focus:border-black focus:ring-1 focus:ring-black rounded-md px-3 py-1.5 text-sm font-bold text-[#111] transition-all outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#333]">
                  折合人民币售价 (元)
                </label>
                <span className="text-[10px] text-[#888]">自动换算联动</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={inputs.priceCNY === 0 ? '' : inputs.priceCNY}
                  onChange={(e) => handlePriceCNYChange(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#FAFAFA] hover:bg-white focus:bg-white border border-[#CCC] focus:border-black focus:ring-1 focus:ring-black rounded-md px-3 py-1.5 text-sm font-bold text-[#111] transition-all outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Row 2: 采购成本 (元) & 人工费用 (元) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#333]">
                  商品采购成本 (元)
                </label>
              </div>
              <input
                type="number"
                step="0.1"
                min="0"
                value={inputs.purchaseCost === 0 ? '' : inputs.purchaseCost}
                onChange={(e) => onChange('purchaseCost', parseFloat(e.target.value) || 0)}
                className="w-full bg-[#FAFAFA] hover:bg-white focus:bg-white border border-[#CCC] focus:border-black focus:ring-1 focus:ring-black rounded-md px-3 py-1.5 text-sm font-bold text-[#111] transition-all outline-hidden"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#333]">
                  人工与打包费用 (元)
                </label>
                <button
                  type="button"
                  onClick={() => onChange('laborCost', Number((inputs.priceCNY * 0.05).toFixed(2)))}
                  className="text-[10px] font-medium text-[#555] hover:text-black border-b border-[#888] cursor-pointer"
                  title="快捷设为售价的5%"
                >
                  设为售价5%
                </button>
              </div>
              <input
                type="number"
                step="0.05"
                min="0"
                value={inputs.laborCost === 0 ? '' : inputs.laborCost}
                onChange={(e) => onChange('laborCost', parseFloat(e.target.value) || 0)}
                placeholder="3.25"
                className="w-full bg-[#FAFAFA] hover:bg-white focus:bg-white border border-[#CCC] focus:border-black focus:ring-1 focus:ring-black rounded-md px-3 py-1.5 text-sm font-bold text-[#111] transition-all outline-hidden"
              />
            </div>
          </div>

          {/* Row 3: 包材耗材 (元) & 管理费用 (元) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#333] mb-1">
                快递耗材与包材成本 (元)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={inputs.packagingCost === 0 ? '' : inputs.packagingCost}
                onChange={(e) => onChange('packagingCost', parseFloat(e.target.value) || 0)}
                placeholder="1"
                className="w-full bg-[#FAFAFA] hover:bg-white focus:bg-white border border-[#CCC] focus:border-black focus:ring-1 focus:ring-black rounded-md px-3 py-1.5 text-sm font-bold text-[#111] transition-all outline-hidden"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#333]">
                  平台佣金 (元)
                </label>
                <button
                  type="button"
                  onClick={() => onChange('managementCost', Number((inputs.priceCNY * 0.08).toFixed(2)))}
                  className="text-[10px] font-medium text-[#555] hover:text-black border-b border-[#888] cursor-pointer"
                  title="快捷设为售价的8%"
                >
                  设为售价8%
                </button>
              </div>
              <input
                type="number"
                step="0.1"
                min="0"
                value={inputs.managementCost === 0 ? '' : inputs.managementCost}
                onChange={(e) => onChange('managementCost', parseFloat(e.target.value) || 0)}
                placeholder="5.2"
                className="w-full bg-[#FAFAFA] hover:bg-white focus:bg-white border border-[#CCC] focus:border-black focus:ring-1 focus:ring-black rounded-md px-3 py-1.5 text-sm font-bold text-[#111] transition-all outline-hidden"
              />
            </div>
          </div>

          {/* Row 4: 平台扣点 (%) & 退货率 (%) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#333]">
                  平台佣金扣点比例 (%)
                </label>
                <div className="flex gap-1 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => onChange('platformRate', 20)}
                    className={`cursor-pointer px-1 py-0.2 rounded-xs ${inputs.platformRate === 20 ? 'bg-black text-white' : 'text-[#666] hover:text-black'}`}
                  >
                    20%
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange('platformRate', 14)}
                    className={`cursor-pointer px-1 py-0.2 rounded-xs ${inputs.platformRate === 14 ? 'bg-black text-white' : 'text-[#666] hover:text-black'}`}
                  >
                    14%
                  </button>
                </div>
              </div>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={inputs.platformRate === 0 ? '' : inputs.platformRate}
                onChange={(e) => onChange('platformRate', parseFloat(e.target.value) || 0)}
                placeholder="20"
                className="w-full bg-[#FAFAFA] hover:bg-white focus:bg-white border border-[#CCC] focus:border-black focus:ring-1 focus:ring-black rounded-md px-3 py-1.5 text-sm font-bold text-[#111] transition-all outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#333] mb-1">
                订单退货折损率 (%)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={inputs.returnRate === 0 ? '' : inputs.returnRate}
                onChange={(e) => onChange('returnRate', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full bg-[#FAFAFA] hover:bg-white focus:bg-white border border-[#CCC] focus:border-black focus:ring-1 focus:ring-black rounded-md px-3 py-1.5 text-sm font-bold text-[#111] transition-all outline-hidden"
              />
            </div>
          </div>

          {/* Row 5: 达人佣金率 (%) & 广告成本 (元) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#333] mb-1">
                达人联盟带货佣金率 (%)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={inputs.affiliateRate === 0 ? '' : inputs.affiliateRate}
                onChange={(e) => onChange('affiliateRate', parseFloat(e.target.value) || 0)}
                placeholder="10"
                className="w-full bg-[#FAFAFA] hover:bg-white focus:bg-white border border-[#CCC] focus:border-black focus:ring-1 focus:ring-black rounded-md px-3 py-1.5 text-sm font-bold text-[#111] transition-all outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#333] mb-1">
                单单直通车广告花费 (元)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={inputs.adCost === 0 ? '' : inputs.adCost}
                onChange={(e) => onChange('adCost', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full bg-[#FAFAFA] hover:bg-white focus:bg-white border border-[#CCC] focus:border-black focus:ring-1 focus:ring-black rounded-md px-3 py-1.5 text-sm font-bold text-[#111] transition-all outline-hidden"
              />
            </div>
          </div>

          {/* Row 6: 汇率 (CNY → R$) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#333]">
                巴西雷亚尔汇率 (1雷亚尔折算人民币)
              </label>
              <div className="flex items-center gap-1">
                {[1.25, 1.3, 1.35].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => handleExchangeRateChange(rate)}
                    className={`text-[11px] font-medium px-1.5 py-0.2 rounded-xs cursor-pointer transition-colors ${
                      inputs.exchangeRate === rate
                        ? 'bg-black text-white font-semibold'
                        : 'bg-[#F5F5F5] border border-[#CCC] text-[#555] hover:text-black'
                    }`}
                  >
                    {rate}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.1"
                value={inputs.exchangeRate === 0 ? '' : inputs.exchangeRate}
                onChange={(e) => handleExchangeRateChange(parseFloat(e.target.value) || 0)}
                placeholder="1.3"
                className="w-full bg-[#FAFAFA] hover:bg-white focus:bg-white border border-[#CCC] focus:border-black focus:ring-1 focus:ring-black rounded-md px-3 py-1.5 text-sm font-bold text-[#111] transition-all outline-hidden"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#777] pointer-events-none">
                1 雷亚尔 = {inputs.exchangeRate} 人民币
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-4 pt-3 border-t border-[#E5E5E5] flex items-center gap-2 text-xs text-[#555]">
        <span className="w-1.5 h-1.5 bg-black rounded-xs shrink-0"></span>
        <span>双向联动汇率与售价，所有毛利与净利实时动态更新</span>
      </div>
    </div>
  );
};

