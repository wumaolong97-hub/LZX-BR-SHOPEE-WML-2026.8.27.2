import React, { useState } from 'react';
import { CalculationResults, ChartSegment } from '../types';
import { getChartSegments } from '../utils/calculator';

interface ProfitChartProps {
  results: CalculationResults;
}

export const ProfitChart: React.FC<ProfitChartProps> = ({ results }) => {
  const [hoveredSegment, setHoveredSegment] = useState<ChartSegment | null>(null);

  const rawSegments = getChartSegments(results);
  const totalAmount = rawSegments.reduce((sum, s) => sum + Math.max(0, s.amount), 0);

  // Calculate SVG arc paths
  const size = 210;
  const center = size / 2;
  const radius = 78;
  const innerRadius = 48;
  const gapAngleDeg = 2.5; // Gap between slices

  let currentAngle = -90; // Start at top

  const validSegments = rawSegments.filter((s) => s.amount > 0);

  const paths = validSegments.map((segment) => {
    const fraction = totalAmount > 0 ? segment.amount / totalAmount : 0;
    const sweepAngle = fraction * 360;
    const startAngle = currentAngle + (validSegments.length > 1 ? gapAngleDeg / 2 : 0);
    const endAngle = currentAngle + sweepAngle - (validSegments.length > 1 ? gapAngleDeg / 2 : 0);
    
    currentAngle += sweepAngle;

    // Convert polar to cartesian
    const startOuter = polarToCartesian(center, center, radius, startAngle);
    const endOuter = polarToCartesian(center, center, radius, endAngle);
    const startInner = polarToCartesian(center, center, innerRadius, endAngle);
    const endInner = polarToCartesian(center, center, innerRadius, startAngle);

    const isLargeArc = sweepAngle - gapAngleDeg > 180 ? 1 : 0;

    const pathData = [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${radius} ${radius} 0 ${isLargeArc} 1 ${endOuter.x} ${endOuter.y}`,
      `L ${startInner.x} ${startInner.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${isLargeArc} 0 ${endInner.x} ${endInner.y}`,
      'Z',
    ].join(' ');

    return {
      segment,
      pathData,
      fraction,
    };
  });

  function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = ((angleInDegrees) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  const activeSegment = hoveredSegment || (validSegments.find((s) => s.id === 'net_profit') || validSegments[0]);

  return (
    <div className="bg-white rounded-lg p-4 md:p-5 border border-[#D5D5D5] shadow-xs h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-2.5 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-black bg-[#EFEFEF] px-1.5 py-0.5 rounded-sm border border-[#CCC]">
              02
            </span>
            <div>
              <h2 className="text-sm md:text-base font-bold text-[#111] tracking-tight">
                销售收入与利润构成透视
              </h2>
              <span className="text-[11px] text-[#777] block mt-0.5">
                有效核销额与全项成本拆解
              </span>
            </div>
          </div>
          <span className="text-[11px] font-medium text-[#444] bg-[#F5F5F5] px-2 py-0.5 rounded border border-[#CCC]">
            按核销后口径
          </span>
        </div>

        {/* Donut Chart Display */}
        <div className="relative flex items-center justify-center my-3">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="overflow-visible"
          >
            {totalAmount === 0 ? (
              <circle
                cx={center}
                cy={center}
                r={(radius + innerRadius) / 2}
                fill="none"
                stroke="#E5E5E5"
                strokeWidth={radius - innerRadius}
              />
            ) : (
              paths.map(({ segment, pathData }) => {
                const isHovered = hoveredSegment?.id === segment.id;
                return (
                  <path
                    key={segment.id}
                    d={pathData}
                    fill={segment.color}
                    className="transition-all duration-200 cursor-pointer"
                    style={{
                      opacity: hoveredSegment ? (isHovered ? 1 : 0.45) : 0.95,
                      transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                      transformOrigin: `${center}px ${center}px`,
                      filter: isHovered ? 'drop-shadow(0 2px 5px rgba(0,0,0,0.12))' : 'none',
                    }}
                    onMouseEnter={() => setHoveredSegment(segment)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                );
              })
            )}

            {/* Inner circle cutout backdrop */}
            <circle
              cx={center}
              cy={center}
              r={innerRadius - 3}
              fill="#FFFFFF"
            />
          </svg>

          {/* Center Info Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-3">
            {activeSegment ? (
              <div className="transition-all duration-150">
                <p className="text-[11px] font-semibold text-[#666] line-clamp-1">
                  {activeSegment.name}
                </p>
                <p className="text-xl font-bold text-[#111] mt-0.5 tracking-tight">
                  ¥{activeSegment.amount.toFixed(2)}
                </p>
                <p className="text-xs font-bold mt-0.5" style={{ color: activeSegment.color }}>
                  占比 {activeSegment.percentage.toFixed(1)}%
                </p>
              </div>
            ) : (
              <div>
                <p className="text-[11px] font-semibold text-[#666]">核销后总销额</p>
                <p className="text-xl font-bold text-[#111]">
                  ¥{results.settledRevenueCNY.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend with colored geometric squares */}
      <div className="mt-1 pt-3 border-t border-[#E5E5E5]">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
          {rawSegments.map((segment) => {
            const isHovered = hoveredSegment?.id === segment.id;
            return (
              <button
                type="button"
                key={segment.id}
                onMouseEnter={() => setHoveredSegment(segment)}
                onMouseLeave={() => setHoveredSegment(null)}
                className={`flex items-center gap-1.5 py-1.5 px-2 rounded text-left transition-colors cursor-pointer border ${
                  isHovered ? 'bg-[#F2F2F2] border-black font-semibold' : 'bg-[#FAFAFA] border-[#E2E2E2] hover:bg-[#F5F5F5]'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-xs shrink-0"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-[#333] text-[11px] font-medium truncate">
                  {segment.name}
                </span>
                <span className="text-[#111] text-[11px] font-bold ml-auto">
                  {segment.percentage > 0 ? `${segment.percentage.toFixed(0)}%` : '0%'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

