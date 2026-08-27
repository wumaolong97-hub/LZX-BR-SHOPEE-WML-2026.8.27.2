import React, { useState, useMemo } from 'react';
import { Ship, Box } from 'lucide-react';

interface ShippingCalculatorProps {
  onImportCost?: (cost: number) => void;
}

export const ShippingCalculator: React.FC<ShippingCalculatorProps> = () => {
  // Sea freight inputs (default to empty)
  const [seaLength, setSeaLength] = useState<number>(0);
  const [seaWidth, setSeaWidth] = useState<number>(0);
  const [seaHeight, setSeaHeight] = useState<number>(0);
  const [seaPcs, setSeaPcs] = useState<number>(0);
  const [cbmCostCNY, setCbmCostCNY] = useState<number>(0);

  // Sea calculations
  const seaCBM = useMemo(() => {
    if (seaLength <= 0 || seaWidth <= 0 || seaHeight <= 0) return 0;
    return (seaLength * seaWidth * seaHeight) / 1000000;
  }, [seaLength, seaWidth, seaHeight]);

  const seaUnitCostCNY = useMemo(() => {
    if (seaCBM <= 0 || seaPcs <= 0 || cbmCostCNY <= 0) return 0;
    const totalCNY = seaCBM * cbmCostCNY;
    return totalCNY / seaPcs;
  }, [seaCBM, seaPcs, cbmCostCNY]);

  return (
    <div className="bg-white rounded-lg p-4 md:p-5 border border-[#D5D5D5] shadow-xs">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-[#E5E5E5]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-black bg-[#EFEFEF] px-1.5 py-0.5 rounded-sm border border-[#CCC]">
              03
            </span>
            <div className="flex items-center gap-1.5">
              <Box size={16} className="text-[#111]" />
              <h2 className="text-sm md:text-base font-bold text-[#111] tracking-tight">
                预估头程计费
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Input Grid & Calculation Output */}
      <div className="pt-1 pb-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-[#333] mb-1">外箱长(CM)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={seaLength === 0 ? '' : seaLength}
              onChange={(e) => setSeaLength(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#FAFAFA] hover:bg-white focus:bg-white border border-[#CCC] focus:border-black focus:ring-1 focus:ring-black rounded-md px-2.5 py-1.5 text-xs font-bold text-[#111] outline-hidden transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#333] mb-1">外箱宽(CM)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={seaWidth === 0 ? '' : seaWidth}
              onChange={(e) => setSeaWidth(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#FAFAFA] hover:bg-white focus:bg-white border border-[#CCC] focus:border-black focus:ring-1 focus:ring-black rounded-md px-2.5 py-1.5 text-xs font-bold text-[#111] outline-hidden transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#333] mb-1">外箱高(CM)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={seaHeight === 0 ? '' : seaHeight}
              onChange={(e) => setSeaHeight(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#FAFAFA] hover:bg-white focus:bg-white border border-[#CCC] focus:border-black focus:ring-1 focus:ring-black rounded-md px-2.5 py-1.5 text-xs font-bold text-[#111] outline-hidden transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#333] mb-1">装箱量(PCS)</label>
            <input
              type="number"
              step="1"
              min="1"
              value={seaPcs === 0 ? '' : seaPcs}
              onChange={(e) => setSeaPcs(parseInt(e.target.value) || 0)}
              className="w-full bg-[#FAFAFA] hover:bg-white focus:bg-white border border-[#CCC] focus:border-black focus:ring-1 focus:ring-black rounded-md px-2.5 py-1.5 text-xs font-bold text-[#111] outline-hidden transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#333] mb-1">1立方费(元)</label>
            <input
              type="number"
              step="10"
              min="0"
              value={cbmCostCNY === 0 ? '' : cbmCostCNY}
              onChange={(e) => setCbmCostCNY(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#FAFAFA] hover:bg-white focus:bg-white border border-[#CCC] focus:border-black focus:ring-1 focus:ring-black rounded-md px-2.5 py-1.5 text-xs font-bold text-[#111] outline-hidden transition-all"
            />
          </div>

          {/* Result Box */}
          <div className="border border-[#D5D5D5] bg-[#FAFAFA] rounded-md px-3 py-1 text-center flex flex-col justify-center min-h-[38px]">
            <span className="text-[10px] text-[#777] font-medium leading-tight">单件海运成本</span>
            <span className="text-sm font-extrabold text-[#111] leading-tight mt-0.5">
              ¥{seaUnitCostCNY > 0 ? seaUnitCostCNY.toFixed(4) : '0.0000'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Summary Row */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-[#777] pt-2.5 mt-1 border-t border-[#EAEAEA]">
        <div className="flex items-center gap-1.5 font-medium">
          <Ship size={12} className="text-[#333]" />
          <span>
            当前单箱体积: <strong className="text-[#111]">{seaCBM.toFixed(4)} CBM</strong> {seaPcs > 0 ? `(装箱${seaPcs}件)` : ''}
          </span>
        </div>
      </div>
    </div>
  );
};
