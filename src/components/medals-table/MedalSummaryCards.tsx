"use client";

import React from "react";

interface MedalTotals {
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

interface MedalSummaryCardsProps {
  totals: MedalTotals;
}

export default function MedalSummaryCards({ totals }: MedalSummaryCardsProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <div className="border rounded-lg p-4 text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 border border-yellow-700"></div>
          <span className="text-sm font-medium text-yellow-800">Gold</span>
        </div>
        <div className="text-2xl font-bold text-yellow-900">{totals.gold}</div>
        <div className="text-xs text-yellow-700">Total Medals</div>
      </div>

      <div className="border rounded-lg p-4 text-center bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 border border-gray-600"></div>
          <span className="text-sm font-medium text-gray-700">Silver</span>
        </div>
        <div className="text-2xl font-bold text-gray-800">{totals.silver}</div>
        <div className="text-xs text-gray-600">Total Medals</div>
      </div>

      <div className="border rounded-lg p-4 text-center bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border border-amber-900"></div>
          <span className="text-sm font-medium text-amber-800">Bronze</span>
        </div>
        <div className="text-2xl font-bold text-amber-900">{totals.bronze}</div>
        <div className="text-xs text-amber-700">Total Medals</div>
      </div>

      <div className="border rounded-lg p-4 text-center bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-sm font-medium text-slate-700">Total</span>
        </div>
        <div className="text-2xl font-bold text-slate-800">{totals.total}</div>
        <div className="text-xs text-slate-600">All Medals</div>
      </div>
    </div>
  );
}
