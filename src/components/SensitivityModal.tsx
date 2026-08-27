import React, { useState } from 'react';
import { X, TrendingUp } from 'lucide-react';
import { CalculatorInputs } from '../types';
import { calculateProfit } from '../utils/calculator';

interface SensitivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: CalculatorInputs;
}

export const SensitivityModal: React.FC<SensitivityModalProps> = ({
  isOpen,
  onClose,
  inputs,
}) => {
  const [activeTab, setActiveTab] = useState<'discount' | 'adSpend'>('discount');

  if (!isOpen) return null;

  // Generate discount scenarios: 0%, 5%, 10%, 15%, 20%, 30%
  const discountPercentages = [0, 5, 10, 15, 20, 30];
  const discountScenarios = discountPercentages.map((disc) => {
    const discountedPriceBRL = inputs.priceBRL * (1 - disc / 100);
    const discountedPriceCNY = inputs.priceCNY * (1 - disc / 100);
    const res = calculateProfit({
      ...inputs,
      priceBRL: discountedPriceBRL,
      priceCNY: discountedPriceCNY,
    });
    return {
      discount: disc,
      priceBRL: discountedPriceBRL,
      priceCNY: discountedPriceCNY,
      netProfitCNY: res.finalNetProfitCNY,
      netProfitRate: res.finalNetProfitRate,
      breakevenROI: res.breakevenROI,
    };
  });

  // Generate ad spend scenarios: ¥0, ¥2, ¥5, ¥8, ¥12, ¥15
  const adSpendValues = [0, 2, 5, 8, 12, 15];
  const adScenarios = adSpendValues.map((ad) => {
    const res = calculateProfit({
      ...inputs,
      adCost: ad,
    });
    return {
      adCost: ad,
      netProfitCNY: res.finalNetProfitCNY,
      netProfitRate: res.finalNetProfitRate,
      adShare: (ad / (inputs.priceCNY || 1)) * 100,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl border border-[#D5D5D5] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#E5E5E5] flex items-center justify-between bg-[#FAFAFA]">
          <div className="flex items-center gap-2.5 text-[#111]">
            <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center text-white shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#111] tracking-tight">多档位盈亏平衡与敏感度测算</h3>
              <p className="text-[11px] text-[#777] mt-0.5">模拟降价促销与广告出价变动下的净利润走势</p>
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

        {/* Modal Tabs */}
        <div className="px-5 pt-2.5 flex gap-3 border-b border-[#E5E5E5] bg-[#FAFAFA]">
          <button
            type="button"
            onClick={() => setActiveTab('discount')}
            className={`pb-2.5 px-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'discount'
                ? 'border-black text-black'
                : 'border-transparent text-[#666] hover:text-black'
            }`}
          >
            01 / 打折促销降价测算
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('adSpend')}
            className={`pb-2.5 px-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'adSpend'
                ? 'border-black text-black'
                : 'border-transparent text-[#666] hover:text-black'
            }`}
          >
            02 / 广告出价盈亏敏感度
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-5">
          {activeTab === 'discount' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] text-[#444] border-b border-[#DDD]">
                    <th className="py-2 px-2.5 font-bold">促销折扣</th>
                    <th className="py-2 px-2.5 font-bold">巴西售价 (雷亚尔)</th>
                    <th className="py-2 px-2.5 font-bold">折合售价 (元)</th>
                    <th className="py-2 px-2.5 font-bold">单件净利润 (元)</th>
                    <th className="py-2 px-2.5 font-bold">实得净利率</th>
                    <th className="py-2 px-2.5 font-bold">保本投产比</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBEB]">
                  {discountScenarios.map((row) => (
                    <tr
                      key={row.discount}
                      className={`hover:bg-[#F9F9F9] transition-colors ${
                        row.discount === 0 ? 'bg-[#F2F2F2] font-semibold' : ''
                      }`}
                    >
                      <td className="py-2 px-2.5">
                        {row.discount === 0 ? (
                          <span className="text-black font-bold">当前原价 (无折扣)</span>
                        ) : (
                          <span className="text-[#333] font-medium">降价 -{row.discount}%</span>
                        )}
                      </td>
                      <td className="py-2 px-2.5 font-medium text-[#111]">
                        R$ {row.priceBRL.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 font-medium text-[#555]">
                        ¥{row.priceCNY.toFixed(2)}
                      </td>
                      <td className={`py-2 px-2.5 font-bold ${row.netProfitCNY >= 0 ? 'text-[#111]' : 'text-red-600'}`}>
                        ¥{row.netProfitCNY.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5">
                        <span className={`px-2 py-0.5 rounded-xs text-[11px] font-semibold ${
                          row.netProfitRate >= 20 ? 'bg-black text-white' : row.netProfitRate > 0 ? 'bg-[#EAEAEA] text-[#222] border border-[#CCC]' : 'bg-red-100 text-red-700'
                        }`}>
                          {row.netProfitRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2 px-2.5 font-medium text-[#444]">
                        {row.breakevenROI > 0 ? row.breakevenROI.toFixed(2) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F5] text-[#444] border-b border-[#DDD]">
                    <th className="py-2 px-2.5 font-bold">单单广告花费 (元)</th>
                    <th className="py-2 px-2.5 font-bold">广告占售价比</th>
                    <th className="py-2 px-2.5 font-bold">单件净利润 (元)</th>
                    <th className="py-2 px-2.5 font-bold">最终实得净利率</th>
                    <th className="py-2 px-2.5 font-bold">经营盈亏状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBEB]">
                  {adScenarios.map((row) => (
                    <tr
                      key={row.adCost}
                      className={`hover:bg-[#F9F9F9] transition-colors ${
                        row.adCost === inputs.adCost ? 'bg-[#F2F2F2] font-semibold' : ''
                      }`}
                    >
                      <td className="py-2 px-2.5 font-medium text-[#111]">
                        ¥{row.adCost.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 font-medium text-[#555]">
                        {row.adShare.toFixed(1)}%
                      </td>
                      <td className={`py-2 px-2.5 font-bold ${row.netProfitCNY >= 0 ? 'text-[#111]' : 'text-red-600'}`}>
                        ¥{row.netProfitCNY.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5">
                        <span className={`px-2 py-0.5 rounded-xs text-[11px] font-semibold ${
                          row.netProfitRate >= 20 ? 'bg-black text-white' : row.netProfitRate > 0 ? 'bg-[#EAEAEA] text-[#222] border border-[#CCC]' : 'bg-red-100 text-red-700'
                        }`}>
                          {row.netProfitRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2 px-2.5">
                        {row.netProfitCNY >= 10 ? (
                          <span className="text-black font-semibold">盈利充裕</span>
                        ) : row.netProfitCNY > 0 ? (
                          <span className="text-[#555] font-medium">微利保本</span>
                        ) : (
                          <span className="text-red-600 font-semibold">亏损赤字</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#FAFAFA] border-t border-[#E5E5E5] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-xs font-bold bg-black hover:bg-neutral-800 text-white transition-colors cursor-pointer"
          >
            关闭测算窗口
          </button>
        </div>
      </div>
    </div>
  );
};

