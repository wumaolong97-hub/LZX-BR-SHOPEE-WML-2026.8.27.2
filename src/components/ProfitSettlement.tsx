import React from 'react';
import { CalculationResults, CalculatorInputs } from '../types';

interface ProfitSettlementProps {
  results: CalculationResults;
  inputs: CalculatorInputs;
}

export const ProfitSettlement: React.FC<ProfitSettlementProps> = ({ results, inputs }) => {
  return (
    <div className="bg-white rounded-lg p-4 md:p-5 border border-[#D5D5D5] shadow-xs h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-black bg-[#EFEFEF] px-1.5 py-0.5 rounded-sm border border-[#CCC]">
              03
            </span>
            <div>
              <h2 className="text-sm md:text-base font-bold text-[#111] tracking-tight">
                最终经营盈亏结算中心
              </h2>
              <span className="text-[11px] text-[#777] block mt-0.5">
                达人带货留存与全包实得净利
              </span>
            </div>
          </div>
        </div>

        {/* 1. 达人营销分析 Card */}
        <div className="bg-[#FAFAFA] border border-[#D5D5D5] rounded-md p-3.5 mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-[#333]">
              达人带货营销利润分析
            </span>
            <span className="text-[11px] font-semibold text-black bg-[#EAEAEA] px-1.5 py-0.5 rounded-xs border border-[#CCC]">
              {inputs.affiliateRate || 0}% 佣金率 (¥{results.affiliateCommissionCNY.toFixed(2)})
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1.5">
            <div>
              <div className="text-2xl font-bold text-[#111] tracking-tight">
                ¥{results.merchantProfitAfterKOLCNY.toFixed(2)}
              </div>
              <div className="text-[11px] text-[#666] mt-0.5">
                商家留存利润 (已扣达人佣金)
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-[#111] tracking-tight">
                {results.merchantProfitRatio.toFixed(1)}%
              </div>
              <div className="text-[10px] text-[#777] mt-0.5">
                占总售价比例
              </div>
            </div>
          </div>
        </div>

        {/* 2. 最终实得净利 (全包口径) Card */}
        <div className="bg-[#EBF7EE] border border-[#BCE4C7] text-[#134E22] rounded-md p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1F5F2F]">
              最终实得全包净利润
            </span>
            <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${
              results.finalNetProfitRate >= 30
                ? 'bg-[#1F5F2F] text-white'
                : results.finalNetProfitRate >= 15
                ? 'bg-[#2E7D32] text-white'
                : results.finalNetProfitRate > 0
                ? 'bg-[#A3D9B0] text-[#134E22]'
                : 'bg-red-600 text-white'
            }`}>
              {results.finalNetProfitRate >= 30
                ? '超高利润'
                : results.finalNetProfitRate >= 15
                ? '稳健盈利'
                : results.finalNetProfitRate > 0
                ? '保本微利'
                : '经营亏损'}
            </span>
          </div>

          <div className="my-2">
            <div className={`text-3xl font-extrabold tracking-tight ${results.finalNetProfitCNY >= 0 ? 'text-[#0D3B17]' : 'text-red-600'}`}>
              ¥{results.finalNetProfitCNY.toFixed(2)}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#246B36] font-medium">
            <span className="w-1.5 h-1.5 rounded-xs bg-[#1F5F2F] shrink-0" />
            <span>已扣除退货损耗 + 广告投流 + 达人佣金</span>
          </div>

          <div className="border-t border-[#CCEAD4] my-2.5" />

          {/* R$ Conversion */}
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-lg md:text-xl font-bold text-[#0D3B17] tracking-tight">
                雷亚尔 R$ {results.finalNetProfitBRL.toFixed(2)}
              </div>
              <div className="text-[10px] text-[#3D794E] mt-0.5 font-medium">
                折合巴西雷亚尔 (汇率 {inputs.exchangeRate})
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-extrabold text-[#0D3B17]">
                {results.finalNetProfitRate.toFixed(1)}%
              </div>
              <div className="text-[10px] text-[#3D794E] font-medium">
                最终实得净利率
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Summary Metrics */}
      <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-xs text-[#555] space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[#444]">全包综合总成本合计:</span>
          <span className="font-bold text-[#111] text-xs md:text-sm">¥{results.allInTotalCostCNY.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#444]">保本直通车广告投放上限:</span>
          <span className="font-bold text-[#111] text-xs md:text-sm">¥{results.maxAffordableAdCost.toFixed(2)} / 单</span>
        </div>
      </div>
    </div>
  );
};

