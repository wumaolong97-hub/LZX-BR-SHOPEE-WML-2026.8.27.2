import { CalculatorInputs, CalculationResults, ChartSegment } from '../types';

export const DEFAULT_INPUTS: CalculatorInputs = {
  productName: '',
  priceBRL: 0,
  priceCNY: 0,
  purchaseCost: 0,
  laborCost: 3.25,
  packagingCost: 1,
  managementCost: 5.2,
  platformRate: 20,
  returnRate: 0,
  affiliateRate: 10,
  adCost: 0,
  exchangeRate: 1.3,
};

export function calculateProfit(inputs: CalculatorInputs): CalculationResults {
  const {
    priceBRL,
    priceCNY,
    purchaseCost,
    laborCost,
    packagingCost,
    managementCost,
    platformRate,
    returnRate,
    affiliateRate,
    adCost,
    exchangeRate,
  } = inputs;

  const validPriceCNY = priceCNY > 0 ? priceCNY : (priceBRL > 0 && exchangeRate > 0 ? priceBRL * exchangeRate : 0);
  const effectiveReturnRate = Math.max(0, Math.min(100, returnRate || 0)) / 100;
  
  // 核销后销额
  const grossRevenueCNY = validPriceCNY;
  const settledRevenueCNY = validPriceCNY * (1 - effectiveReturnRate);

  // 各项成本计算 (基于核销后销额与发货损耗)
  // 平台扣点一般按核销后实际销售额扣除
  const platformFeeCNY = settledRevenueCNY * ((platformRate || 0) / 100);
  
  // 采购成本 (退货率下实际留存订单成本 + 退货损耗按实发计)
  // 当退货率为0时，采购成本 = purchaseCost
  // 当有退货时，有效采购成本为 purchaseCost * (1 - effectiveReturnRate)，未发出的货可重新入库或按退回计
  // 退货包材及运费损耗通常包含在包装人工中
  const purchaseCostCNY = purchaseCost * (1 - effectiveReturnRate);
  const returnLossCNY = purchaseCost * effectiveReturnRate * 0.15; // 假设15%退货折损/运费

  const laborCostCNY = Number(laborCost || 0);
  const packagingCostCNY = Number(packagingCost || 0);
  const managementCostCNY = Number(managementCost || 0);
  const laborPackagingManagementCNY = laborCostCNY + packagingCostCNY + managementCostCNY;

  // 基础总成本 (采购 + 平台 + 人工 + 包材 + 管理)
  const baseTotalCostCNY = purchaseCostCNY + platformFeeCNY + laborPackagingManagementCNY;

  // 基础毛利 (未扣达人与广告)
  const baseGrossProfitCNY = Math.max(0, settledRevenueCNY - baseTotalCostCNY);

  // 达人佣金
  const affiliateCommissionCNY = settledRevenueCNY * ((affiliateRate || 0) / 100);

  // 商家利润 (已扣达人佣金)
  const merchantProfitAfterKOLCNY = baseGrossProfitCNY - affiliateCommissionCNY;
  const merchantProfitRatio = validPriceCNY > 0 ? (merchantProfitAfterKOLCNY / validPriceCNY) * 100 : 0;

  // 广告成本
  const adCostCNY = Number(adCost || 0);

  // 最终实得净利 (ALL-IN)
  const finalNetProfitCNY = merchantProfitAfterKOLCNY - adCostCNY - (effectiveReturnRate > 0 ? returnLossCNY : 0);

  // 最终净利率 (实得 / 核销后销额)
  const finalNetProfitRate = settledRevenueCNY > 0 ? (finalNetProfitCNY / settledRevenueCNY) * 100 : 0;

  // 转换至 R$
  const finalNetProfitBRL = exchangeRate > 0 ? finalNetProfitCNY / exchangeRate : 0;

  // 保本 ROI = 售价 / 基础毛利额 (推广盈亏平衡点，如果投流直通车)
  // 当 baseGrossProfitCNY > 0 时, 保本 ROI = grossRevenueCNY / baseGrossProfitCNY
  const breakevenROI = baseGrossProfitCNY > 0 ? validPriceCNY / baseGrossProfitCNY : 0;

  // 最大可承受广告预算 (保本广告费)
  const maxAffordableAdCost = Math.max(0, merchantProfitAfterKOLCNY);

  return {
    grossRevenueCNY,
    settledRevenueCNY,
    platformFeeCNY,
    purchaseCostCNY,
    laborCostCNY,
    packagingCostCNY,
    managementCostCNY,
    laborPackagingManagementCNY,
    affiliateCommissionCNY,
    adCostCNY,
    returnLossCNY,
    baseTotalCostCNY,
    allInTotalCostCNY: baseTotalCostCNY + affiliateCommissionCNY + adCostCNY + returnLossCNY,
    baseGrossProfitCNY,
    merchantProfitAfterKOLCNY,
    merchantProfitRatio,
    finalNetProfitCNY,
    finalNetProfitBRL,
    finalNetProfitRate,
    breakevenROI,
    maxAffordableAdCost,
  };
}

export function getChartSegments(results: CalculationResults): ChartSegment[] {
  const {
    laborPackagingManagementCNY,
    platformFeeCNY,
    adCostCNY,
    finalNetProfitCNY,
    affiliateCommissionCNY,
    purchaseCostCNY,
    settledRevenueCNY,
  } = results;

  const total = settledRevenueCNY > 0 ? settledRevenueCNY : 1;

  const segments: ChartSegment[] = [
    {
      id: 'labor_pkg_mgmt',
      name: '人工+包材+平台佣金',
      amount: laborPackagingManagementCNY,
      percentage: (laborPackagingManagementCNY / total) * 100,
      color: '#8b5cf6', // Purple
    },
    {
      id: 'platform_fee',
      name: '平台扣点',
      amount: platformFeeCNY,
      percentage: (platformFeeCNY / total) * 100,
      color: '#f97316', // Orange
    },
    {
      id: 'ad_cost',
      name: '广告费',
      amount: adCostCNY,
      percentage: (adCostCNY / total) * 100,
      color: '#ef4444', // Red
    },
    {
      id: 'net_profit',
      name: '最终净利',
      amount: Math.max(0, finalNetProfitCNY),
      percentage: Math.max(0, (finalNetProfitCNY / total) * 100),
      color: '#10b981', // Emerald
    },
    {
      id: 'affiliate_commission',
      name: '达人佣金',
      amount: affiliateCommissionCNY,
      percentage: (affiliateCommissionCNY / total) * 100,
      color: '#ec4899', // Pink
    },
    {
      id: 'purchase_cost',
      name: '采购成本',
      amount: purchaseCostCNY,
      percentage: (purchaseCostCNY / total) * 100,
      color: '#0284c7', // Sky blue
    },
  ];

  return segments;
}

/**
 * 反向推算定价: 给定目标净利率，计算所需售价 (BRL & CNY)
 */
export function calculateReversePricing(
  targetNetMarginPercent: number,
  params: Omit<CalculatorInputs, 'priceBRL' | 'priceCNY'>
) {
  const {
    purchaseCost,
    laborCost,
    packagingCost,
    managementCost,
    platformRate,
    affiliateRate,
    adCost,
    exchangeRate,
    returnRate,
  } = params;

  const retRate = Math.max(0, Math.min(99, returnRate || 0)) / 100;
  const targetMargin = targetNetMarginPercent / 100;
  const platRate = (platformRate || 0) / 100;
  const affRate = (affiliateRate || 0) / 100;

  // Formula:
  // Settled Revenue R = Price * (1 - retRate)
  // Costs = Purchase*(1-retRate) + FixedCosts (labor + pkg + mgmt + ad) + R*(platRate + affRate)
  // Net Profit = R - Costs = R*(1 - platRate - affRate) - (Purchase*(1-retRate) + FixedCosts)
  // Target Net Profit = R * targetMargin
  // R * (1 - platRate - affRate - targetMargin) = Purchase*(1-retRate) + FixedCosts
  const fixedCosts = Number(laborCost || 0) + Number(packagingCost || 0) + Number(managementCost || 0) + Number(adCost || 0);
  const directCost = purchaseCost * (1 - retRate) + fixedCosts;
  const marginDenominator = 1 - platRate - affRate - targetMargin;

  if (marginDenominator <= 0.01) {
    return {
      priceCNY: 0,
      priceBRL: 0,
      feasible: false,
    };
  }

  const settledRev = directCost / marginDenominator;
  const priceCNY = retRate < 1 ? settledRev / (1 - retRate) : settledRev;
  const priceBRL = exchangeRate > 0 ? priceCNY / exchangeRate : 0;

  return {
    priceCNY: Number(priceCNY.toFixed(2)),
    priceBRL: Number(priceBRL.toFixed(2)),
    feasible: true,
  };
}
