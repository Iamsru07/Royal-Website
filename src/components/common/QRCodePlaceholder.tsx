import React, { useState } from 'react';
import { Download, Printer, Copy, Check, QrCode } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface QRCodePlaceholderProps {
  tableNumber: string;
}

export const QRCodePlaceholder: React.FC<QRCodePlaceholderProps> = ({ tableNumber }) => {
  const { showToast } = useRestaurant();
  const [copied, setCopied] = useState(false);
  
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const menuUrl = `${origin}/menu?table=${tableNumber}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(menuUrl);
    setCopied(true);
    showToast(`Table ${tableNumber} ordering link copied!`, 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    showToast(`Downloaded QR Code for Table ${tableNumber}`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm max-w-sm mx-auto text-center">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60">
          Table {tableNumber}
        </span>
      </div>

      <h4 className="text-lg font-bold text-neutral-900 font-serif-brand mb-1">
        Scan to View Menu & Order
      </h4>
      <p className="text-xs text-neutral-500 mb-5">
        Guests scan this QR code with their mobile camera to order directly.
      </p>

      {/* Realistic Stylized QR matrix container */}
      <div className="p-4 bg-white border-2 border-neutral-900/10 rounded-2xl shadow-sm relative group mb-5">
        <div className="w-52 h-52 bg-white relative flex flex-col justify-between p-2">
          {/* Top Row Finders */}
          <div className="flex justify-between w-full">
            <div className="w-12 h-12 border-[5px] border-neutral-900 rounded-lg flex items-center justify-center p-1.5">
              <div className="w-5 h-5 bg-neutral-900 rounded-xs" />
            </div>
            <div className="w-12 h-12 border-[5px] border-neutral-900 rounded-lg flex items-center justify-center p-1.5">
              <div className="w-5 h-5 bg-neutral-900 rounded-xs" />
            </div>
          </div>

          {/* Center Matrix Simulation with Table Badge */}
          <div className="my-auto flex flex-col items-center justify-center py-2 relative">
            <div className="grid grid-cols-8 gap-1.5 opacity-80 mb-2">
              <div className="w-2.5 h-2.5 bg-neutral-900 rounded-xs" />
              <div className="w-2.5 h-2.5 bg-neutral-900 rounded-xs" />
              <div className="w-2.5 h-2.5 bg-transparent" />
              <div className="w-2.5 h-2.5 bg-neutral-900 rounded-xs" />
              <div className="w-2.5 h-2.5 bg-neutral-900 rounded-xs" />
              <div className="w-2.5 h-2.5 bg-transparent" />
              <div className="w-2.5 h-2.5 bg-neutral-900 rounded-xs" />
              <div className="w-2.5 h-2.5 bg-neutral-900 rounded-xs" />
            </div>

            {/* Central Table Icon Seal */}
            <div className="z-10 bg-amber-600 text-white rounded-xl shadow-md px-3 py-1 flex items-center gap-1.5 border-2 border-white">
              <QrCode className="w-4 h-4" />
              <span className="text-xs font-bold font-mono tracking-tight">T-{tableNumber}</span>
            </div>

            <div className="grid grid-cols-8 gap-1.5 opacity-80 mt-2">
              <div className="w-2.5 h-2.5 bg-transparent" />
              <div className="w-2.5 h-2.5 bg-neutral-900 rounded-xs" />
              <div className="w-2.5 h-2.5 bg-neutral-900 rounded-xs" />
              <div className="w-2.5 h-2.5 bg-transparent" />
              <div className="w-2.5 h-2.5 bg-neutral-900 rounded-xs" />
              <div className="w-2.5 h-2.5 bg-neutral-900 rounded-xs" />
              <div className="w-2.5 h-2.5 bg-transparent" />
              <div className="w-2.5 h-2.5 bg-neutral-900 rounded-xs" />
            </div>
          </div>

          {/* Bottom Finder */}
          <div className="flex justify-between items-end w-full">
            <div className="w-12 h-12 border-[5px] border-neutral-900 rounded-lg flex items-center justify-center p-1.5">
              <div className="w-5 h-5 bg-neutral-900 rounded-xs" />
            </div>
            <div className="w-7 h-7 border-[3px] border-neutral-900 rounded-md flex items-center justify-center p-1">
              <div className="w-2.5 h-2.5 bg-neutral-900 rounded-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* Target URL with Copy Button */}
      <div className="w-full flex items-center justify-between px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200/70 mb-5 text-left">
        <span className="text-xs font-mono text-neutral-600 truncate max-w-[210px]">
          /menu?table={tableNumber}
        </span>
        <button
          onClick={handleCopy}
          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-md transition-colors"
          title="Copy link"
          aria-label="Copy table ordering URL"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 w-full">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200/80 rounded-xl transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Standee</span>
        </button>
      </div>
    </div>
  );
};
