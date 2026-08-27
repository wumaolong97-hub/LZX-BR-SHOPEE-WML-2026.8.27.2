import React from 'react';
import { Calculator, RotateCcw, Copy, Check, Sparkles, TrendingUp, History, Download } from 'lucide-react';
import { CalculatorInputs, CalculationResults } from '../types';

interface HeaderProps {
  onReset: () => void;
  onOpenReversePricing: () => void;
  onOpenSensitivity: () => void;
  onOpenHistory: () => void;
  onSaveCurrent: () => void;
  inputs: CalculatorInputs;
  results: CalculationResults;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onOpenReversePricing,
  onOpenSensitivity,
  onOpenHistory,
  onSaveCurrent,
  inputs,
  results,
  savedCount,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopySummary = async () => {
    const text = `【${inputs.productName || '巴西站商品'} 利润测算结果】
• 售价: 雷亚尔 R$ ${inputs.priceBRL.toFixed(2)} (折合人民币 ¥${inputs.priceCNY.toFixed(2)})
• 汇率: 1 雷亚尔 = ${inputs.exchangeRate} 人民币
• 采购成本: ¥${inputs.purchaseCost.toFixed(2)}
• 平台扣点: ${inputs.platformRate}% (¥${results.platformFeeCNY.toFixed(2)})
• 达人佣金: ${inputs.affiliateRate}% (¥${results.affiliateCommissionCNY.toFixed(2)})
• 基础毛利: ¥${results.baseGrossProfitCNY.toFixed(2)}
• 最终实得净利: ¥${results.finalNetProfitCNY.toFixed(2)} (折合 R$ ${results.finalNetProfitBRL.toFixed(2)})
• 最终净利率: ${results.finalNetProfitRate.toFixed(2)}%
• 保本推广投产比: ${results.breakevenROI.toFixed(2)}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="bg-white rounded-lg py-3.5 px-4 md:px-6 border border-[#D5D5D5] shadow-xs mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Title & Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black rounded-md flex items-center justify-center shrink-0 shadow-xs">
            <div className="w-4 h-4 border-2 border-white rotate-45"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-bold text-[#111] tracking-tight">
                LZX 巴西 Shopee WML 计价表
              </h1>
              <span className="inline-block text-[11px] font-semibold text-black bg-[#EFEFEF] px-1.5 py-0.5 rounded-sm border border-[#CCC]">
                实时核算
              </span>
            </div>
            <p className="text-xs text-[#666] mt-0.5">
              巴西站全流程精细化毛利 · 净利 · 投产比核算系统
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpenReversePricing}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-[#F5F5F5] text-[#111] hover:bg-[#E8E8E8] transition-colors border border-[#CCC] cursor-pointer"
            title="输入目标净利率，反向推算商品售价"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>目标反向推算</span>
          </button>

          <button
            type="button"
            onClick={onOpenSensitivity}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-[#F5F5F5] text-[#111] hover:bg-[#E8E8E8] transition-colors border border-[#CCC] cursor-pointer"
            title="多档位降价/广告敏感度测算"
          >
            <TrendingUp className="w-3.5 h-3.5 text-black" />
            <span>多档位盈亏测算</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-[#F5F5F5] text-[#111] hover:bg-[#E8E8E8] transition-colors border border-[#CCC] cursor-pointer"
            title="一键复制格式化利润简报"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-black" />}
            <span>{copied ? '已复制简报' : '复制简报'}</span>
          </button>

          <button
            type="button"
            onClick={onSaveCurrent}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
            title="保存此测算记录"
          >
            <Download className="w-3.5 h-3.5" />
            <span>保存记录</span>
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-[#F5F5F5] text-[#111] hover:bg-[#E8E8E8] transition-colors border border-[#CCC] relative cursor-pointer"
            title="查看已保存的计价记录"
          >
            <History className="w-3.5 h-3.5 text-black" />
            <span>历史记录</span>
            {savedCount > 0 && (
              <span className="w-4 h-4 bg-black text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-[#666] hover:text-black hover:bg-[#EFEFEF] transition-colors cursor-pointer"
            title="重置为默认数据"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">重置</span>
          </button>
        </div>
      </div>
    </header>
  );
};

