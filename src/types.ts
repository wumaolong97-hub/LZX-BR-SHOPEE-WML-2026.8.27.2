export interface CalculatorInputs {
  productName: string;
  priceBRL: number;
  priceCNY: number;
  purchaseCost: number;
  laborCost: number;
  packagingCost: number;
  managementCost: number;
  platformRate: number; // percentage (e.g. 20)
  returnRate: number;   // percentage (e.g. 0)
  affiliateRate: number;// percentage (e.g. 10)
  adCost: number;       // CNY
  exchangeRate: number; // 1 BRL = X CNY (default 1.30)
}

export interface CalculationResults {
  // Revenue
  grossRevenueCNY: number;
  settledRevenueCNY: number; // 核销后销额 (扣除退货率后)
  
  // Costs in CNY
  platformFeeCNY: number;     // 平台扣点
  purchaseCostCNY: number;    // 采购成本
  laborCostCNY: number;       // 人工费用
  packagingCostCNY: number;   // 包材耗材
  managementCostCNY: number;  // 管理费/固定开支
  affiliateCommissionCNY: number; // 达人佣金
  adCostCNY: number;          // 直通车/广告成本
  returnLossCNY: number;      // 退货造成的实际损耗 (包材/运费等损耗)
  
  // Aggregate Costs
  laborPackagingManagementCNY: number; // 人工+包材+管理
  baseTotalCostCNY: number;            // 基础总成本 (采购+平台+人工+包材+管理)
  allInTotalCostCNY: number;           // 全包总成本 (含达人+广告+退货损耗)

  // Profit Metrics
  baseGrossProfitCNY: number;          // 基础毛利 (未扣达人与广告)
  merchantProfitAfterKOLCNY: number;   // 商家利润 (已扣达人佣金, 未扣广告)
  merchantProfitRatio: number;         // 商家利润占售价比 (%)
  
  finalNetProfitCNY: number;           // 最终实得净利 (ALL-IN)
  finalNetProfitBRL: number;           // 转换至 R$
  finalNetProfitRate: number;          // 最终净利率 (实得/核销后销额 %)
  
  // Marketing Metrics
  breakevenROI: number;                // 保本 ROI (推广盈亏平衡点)
  maxAffordableAdCost: number;         // 最大可承受广告预算 (保本广告费)
}

export interface ChartSegment {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface SavedRecord {
  id: string;
  timestamp: number;
  inputs: CalculatorInputs;
  results: CalculationResults;
}
