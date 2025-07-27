"use client";

import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import medalsData from "@/app/medals.json";

import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

interface MedalData {
  code: string;
  gold: number;
  silver: number;
  bronze: number;
  total?: number;
  rank?: number;
}

// Simple cell renderer for medal counts without colors
const MedalCellRenderer = (params: ICellRendererParams) => {
  return (
    <div className="px-2 py-1 text-center font-semibold">{params.value}</div>
  );
};

// Simple country code cell renderer
const CountryCellRenderer = (params: ICellRendererParams) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-4 border rounded flex items-center justify-center text-xs">
        {params.value}
      </div>
      <span className="font-medium">{params.value}</span>
    </div>
  );
};

// Simplified rank cell renderer without borders and styling
const RankCellRenderer = (params: ICellRendererParams) => {
  return <div className="text-center">#{params.value}</div>;
};

export default function MedalsTable() {
  // Process data to add totals and rankings
  const processedData = useMemo(() => {
    const dataWithTotals = medalsData.map((country: MedalData) => ({
      ...country,
      total: country.gold + country.silver + country.bronze,
    }));

    // Sort by gold medals first, then silver, then bronze
    const sortedData = dataWithTotals.sort((a, b) => {
      if (a.gold !== b.gold) return b.gold - a.gold;
      if (a.silver !== b.silver) return b.silver - a.silver;
      return b.bronze - a.bronze;
    });

    // Add rankings
    return sortedData.map((country, index) => ({
      ...country,
      rank: index + 1,
    }));
  }, []);

  // Column definitions
  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "rank",
        headerName: "Rank",
        cellRenderer: RankCellRenderer,
        sortable: false,
        width: 100,
      },
      {
        field: "code",
        headerName: "Country",
        cellRenderer: CountryCellRenderer,
        flex: 1,
        minWidth: 150,
      },
      {
        field: "gold",
        headerName: "Gold",
        cellRenderer: MedalCellRenderer,
        sort: "desc",
        width: 100,
      },
      {
        field: "silver",
        headerName: "Silver",
        cellRenderer: MedalCellRenderer,
        width: 100,
      },
      {
        field: "bronze",
        headerName: "Bronze",
        cellRenderer: MedalCellRenderer,
        width: 100,
      },
      {
        field: "total",
        headerName: "Total",
        cellRenderer: MedalCellRenderer,
        width: 100,
      },
    ],
    []
  );

  // Grid options
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
    }),
    []
  );

  // Calculate totals for footer
  const totals = useMemo(() => {
    return processedData.reduce(
      (acc, country) => ({
        gold: acc.gold + country.gold,
        silver: acc.silver + country.silver,
        bronze: acc.bronze + country.bronze,
        total: acc.total + country.total,
      }),
      { gold: 0, silver: 0, bronze: 0, total: 0 }
    );
  }, [processedData]);

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Olympics Medal Table
        </h2>
        <div className="text-sm text-gray-600">
          Total Countries: {processedData.length}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{totals.gold}</div>
          <div className="text-sm">Total Gold</div>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{totals.silver}</div>
          <div className="text-sm">Total Silver</div>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{totals.bronze}</div>
          <div className="text-sm">Total Bronze</div>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{totals.total}</div>
          <div className="text-sm">Total Medals</div>
        </div>
      </div>

      {/* AG Grid Table */}
      <div
        className="ag-theme-alpine"
        style={{ height: 600, width: "100%", maxWidth: 700 }}
      >
        <AgGridReact
          rowData={processedData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          enableCellTextSelection={true}
          suppressRowClickSelection={true}
          rowSelection="multiple"
          rowMultiSelectWithClick={true}
          suppressMenuHide={true}
          domLayout="normal"
        />
      </div>

      <div className="text-xs text-gray-500 text-center">
        Data sorted by Gold medals (descending), then Silver, then Bronze
      </div>
    </div>
  );
}
