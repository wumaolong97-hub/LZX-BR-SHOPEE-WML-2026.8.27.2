import React from 'react';
import { X, Trash2, ArrowUpRight, Clock } from 'lucide-react';
import { SavedRecord } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  records: SavedRecord[];
  onLoadRecord: (record: SavedRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  records,
  onLoadRecord,
  onDeleteRecord,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col border-l border-[#D5D5D5] animate-in slide-in-from-right duration-150">
        {/* Drawer Header */}
        <div className="p-4 md:p-5 border-b border-[#E5E5E5] flex items-center justify-between bg-[#FAFAFA]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center text-white shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-[#111] text-sm tracking-tight">已保存的商品测算记录</h3>
              <p className="text-[11px] text-[#777] mt-0.5">历史报价方案快速读取与切换</p>
            </div>
            <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.2 rounded-xs ml-1">
              {records.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#666] hover:text-black p-1 rounded-md hover:bg-[#EFEFEF] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-3">
          {records.length === 0 ? (
            <div className="text-center py-16 text-[#777]">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-30 text-black" />
              <p className="text-xs font-bold text-[#333]">暂无历史保存记录</p>
              <p className="text-[11px] mt-0.5 text-[#888]">点击页面右上角「保存记录」即可存档对比</p>
            </div>
          ) : (
            records.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#FAFAFA] hover:bg-white border border-[#D5D5D5] hover:border-black rounded-md p-3 transition-all duration-150 relative group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-xs md:text-sm text-[#111] tracking-tight">
                      {rec.inputs.productName || '未命名商品'}
                    </h4>
                    <span className="text-[10px] text-[#888] block mt-0.5">
                      {new Date(rec.timestamp).toLocaleString('zh-CN', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteRecord(rec.id)}
                    className="text-[#999] hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                    title="删除"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 my-2 text-xs bg-white rounded p-2.5 border border-[#E5E5E5]">
                  <div>
                    <span className="text-[#777] text-[10px] block">售价 (R$ / ¥)</span>
                    <span className="font-bold text-[#111] text-xs mt-0.5 block">
                      R$ {rec.inputs.priceBRL.toFixed(1)} <span className="text-[10px] text-[#666]">(¥{rec.inputs.priceCNY.toFixed(1)})</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[#777] text-[10px] block">最终净利 (利率)</span>
                    <span className={`font-bold text-xs mt-0.5 block ${rec.results.finalNetProfitCNY >= 0 ? 'text-[#111]' : 'text-red-600'}`}>
                      ¥{rec.results.finalNetProfitCNY.toFixed(2)} ({rec.results.finalNetProfitRate.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-[11px] text-[#555]">
                    保本ROI: <b className="text-black font-bold">{rec.results.breakevenROI.toFixed(2)}</b>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onLoadRecord(rec);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-black hover:underline cursor-pointer"
                  >
                    <span>载入此方案</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {records.length > 0 && (
          <div className="p-4 border-t border-[#E5E5E5] bg-[#FAFAFA] flex items-center justify-between">
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
            >
              清空记录
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-md text-xs font-bold bg-black text-white hover:bg-neutral-800 cursor-pointer shadow-xs"
            >
              完成并关闭
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

