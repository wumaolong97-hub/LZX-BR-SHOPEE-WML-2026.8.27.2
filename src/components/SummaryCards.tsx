import React from 'react';
import { CalculationResults, CalculatorInputs } from '../types';

interface SummaryCardsProps {
  results: CalculationResults;
  inputs: CalculatorInputs;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ results, inputs }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4">
      {/* 1. 核销后销额 */}
      <div className="bg-white hover:border-black transition-all border border-[#D5D5D5] rounded-lg p-4 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#555]">
            核销后有效销额
          </span>
          <span className="w-1.5 h-1.5 rounded-xs bg-[#111]"></span>
        </div>
        <div className="my-2">
          <span className="text-2xl md:text-[26px] font-bold text-[#111] tracking-tight">
            ¥{results.settledRevenueCNY.toFixed(2)}
          </span>
        </div>
        <div>
          <div className="flex justify-between text-[11px] font-medium text-[#666] mb-1.5">
            <span>扣除退货率 {inputs.returnRate || 0}%</span>
            <span className="text-[#111]">有效回款总额</span>
          </div>
          <div className="h-1.5 w-full bg-[#EBEBEB] rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${Math.max(5, Math.min(100, 100 - (inputs.returnRate || 0)))}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 2. 基础毛利 */}
      <div className="bg-white hover:border-black transition-all border border-[#D5D5D5] rounded-lg p-4 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#555]">
            基础毛利润
          </span>
          <span className="w-1.5 h-1.5 rounded-xs bg-[#555]"></span>
        </div>
        <div className="my-2">
          <span className="text-2xl md:text-[26px] font-bold text-[#111] tracking-tight">
            ¥{results.baseGrossProfitCNY.toFixed(2)}
          </span>
        </div>
        <div>
          <div className="flex justify-between text-[11px] font-medium text-[#666] mb-1.5">
            <span>未扣达人与广告</span>
            <span className="text-[#111] font-semibold">
              毛利率{' '}
              {results.settledRevenueCNY > 0
                ? `${((results.baseGrossProfitCNY / results.settledRevenueCNY) * 100).toFixed(1)}%`
                : '0%'}
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#EBEBEB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#444] transition-all duration-300"
              style={{
                width: `${Math.max(
                  0,
                  Math.min(
                    100,
                    results.settledRevenueCNY > 0
                      ? (results.baseGrossProfitCNY / results.settledRevenueCNY) * 100
                      : 0
                  )
                )}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* 3. 最终净利率 */}
      <div className="bg-white hover:border-black transition-all border border-[#D5D5D5] rounded-lg p-4 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#555]">
            最终实得净利率
          </span>
          <span
            className={`w-1.5 h-1.5 rounded-xs ${
              results.finalNetProfitRate >= 20
                ? 'bg-black'
                : results.finalNetProfitRate > 0
                ? 'bg-[#666]'
                : 'bg-red-600'
            }`}
          ></span>
        </div>
        <div className="my-2">
          <span
            className={`text-2xl md:text-[26px] font-bold tracking-tight ${
              results.finalNetProfitRate >= 0 ? 'text-[#111]' : 'text-red-600'
            }`}
          >
            {results.finalNetProfitRate.toFixed(2)}%
          </span>
        </div>
        <div>
          <div className="flex justify-between text-[11px] font-medium text-[#666] mb-1.5">
            <span>全包实得 / 销额</span>
            <span className={`font-semibold ${results.finalNetProfitRate >= 20 ? 'text-black' : results.finalNetProfitRate > 0 ? 'text-[#333]' : 'text-red-600'}`}>
              {results.finalNetProfitRate >= 30
                ? '超高利润'
                : results.finalNetProfitRate >= 20
                ? '稳健盈利'
                : results.finalNetProfitRate > 0
                ? '微利保本'
                : '经营亏损'}
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#EBEBEB] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                results.finalNetProfitRate >= 0 ? 'bg-black' : 'bg-red-600'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, results.finalNetProfitRate))}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 4. 保本 ROI */}
      <div className="bg-white hover:border-black transition-all border border-[#D5D5D5] rounded-lg p-4 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#555]">
            保本推广投产比
          </span>
          <span className="w-1.5 h-1.5 rounded-xs bg-[#888]"></span>
        </div>
        <div className="my-2">
          <span className="text-2xl md:text-[26px] font-bold text-[#111] tracking-tight">
            {results.breakevenROI > 0 ? results.breakevenROI.toFixed(2) : '-'}
          </span>
        </div>
        <div>
          <div className="flex justify-between text-[11px] font-medium text-[#666] mb-1.5">
            <span>直通车盈亏平衡点</span>
            <span className="text-[#111] font-semibold">
              目标投产需 &gt; {results.breakevenROI > 0 ? results.breakevenROI.toFixed(1) : '2.0'}
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#EBEBEB] rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-300"
              style={{
                width: `${Math.max(
                  10,
                  Math.min(100, results.breakevenROI > 0 ? (1 / results.breakevenROI) * 100 : 50)
                )}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

