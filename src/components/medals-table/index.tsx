"use client";

import React, { useMemo, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ICellRendererParams,
  RowClassRules,
  IHeaderParams,
} from "ag-grid-community";
import medalsData from "@/app/medals.json";
import { getFlagByCode } from "@/lib/get-flag-by-code";

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

// Medal type configurations
const medalConfigs = {
  gold: {
    label: "Gold",
    iconClasses:
      "w-4 h-4 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 border border-yellow-700",
  },
  silver: {
    label: "Silver",
    iconClasses:
      "w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 border border-gray-600",
  },
  bronze: {
    label: "Bronze",
    iconClasses:
      "w-4 h-4 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border border-amber-900",
  },
  total: {
    label: "Total",
    iconClasses: null, // No icon for total
  },
};

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
      <div
        className="w-6 h-4 border rounded flex items-center justify-center text-xs"
        style={getFlagByCode(params.data.code)}
      />
      <span className="font-medium">{params.data.code}</span>
    </div>
  );
};

// Simplified rank cell renderer without borders and styling
const RankCellRenderer = (params: ICellRendererParams) => {
  return <div className="text-center">#{params.value}</div>;
};

// Simplified reusable header renderer for all medal types
const MedalHeaderRenderer = (medalType: keyof typeof medalConfigs) => {
  const HeaderComponent = (params: IHeaderParams) => {
    const [sortDirection, setSortDirection] = useState(params.column.getSort());
    const config = medalConfigs[medalType];

    useEffect(() => {
      const updateSortDirection = () => {
        setSortDirection(params.column.getSort());
      };

      params.column.addEventListener("sortChanged", updateSortDirection);
      return () => {
        params.column.removeEventListener("sortChanged", updateSortDirection);
      };
    }, [params.column]);

    const onSortClicked = () => {
      params.progressSort(true);
    };

    return (
      <div
        className="flex items-center gap-2 justify-center cursor-pointer hover:bg-gray-100 p-1 rounded"
        onClick={onSortClicked}
      >
        {config.iconClasses && <div className={config.iconClasses}></div>}
        <span>{config.label}</span>
        {sortDirection === "asc" && <span className="text-xs">↑</span>}
        {sortDirection === "desc" && <span className="text-xs">↓</span>}
      </div>
    );
  };

  HeaderComponent.displayName = `MedalHeader_${medalType}`;
  return HeaderComponent;
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
        sortable: true,
      },
      {
        field: "gold",
        headerName: "Gold",
        headerComponent: MedalHeaderRenderer("gold"),
        cellRenderer: MedalCellRenderer,
        sortable: true,
        sort: "desc",
        width: 120,
        type: "numericColumn",
        suppressMenu: true,
      },
      {
        field: "silver",
        headerName: "Silver",
        headerComponent: MedalHeaderRenderer("silver"),
        cellRenderer: MedalCellRenderer,
        sortable: true,
        width: 120,
        type: "numericColumn",
        suppressMenu: true,
      },
      {
        field: "bronze",
        headerName: "Bronze",
        headerComponent: MedalHeaderRenderer("bronze"),
        cellRenderer: MedalCellRenderer,
        sortable: true,
        width: 120,
        type: "numericColumn",
        suppressMenu: true,
      },
      {
        field: "total",
        headerName: "Total",
        headerComponent: MedalHeaderRenderer("total"),
        cellRenderer: MedalCellRenderer,
        sortable: true,
        width: 120,
        type: "numericColumn",
        suppressMenu: true,
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

  // Row class rules for medal colors
  const rowClassRules = useMemo(
    () => ({
      "first-place": (params: ICellRendererParams) => params.data.rank === 1,
      "second-place": (params: ICellRendererParams) => params.data.rank === 2,
      "third-place": (params: ICellRendererParams) => params.data.rank === 3,
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
    <div className="w-full max-w-[800px] mx-auto space-y-4 p-4">
      <style jsx>{`
        :global(.first-place) {
          background-color: #fef3c7 !important; /* Light gold */
        }
        :global(.second-place) {
          background-color: #f3f4f6 !important; /* Light silver */
        }
        :global(.third-place) {
          background-color: #f0d9b5 !important; /* Light bronze */
        }
      `}</style>

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
        <div className="border rounded-lg p-4 text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 border border-yellow-700"></div>
            <span className="text-sm font-medium text-yellow-800">Gold</span>
          </div>
          <div className="text-2xl font-bold text-yellow-900">
            {totals.gold}
          </div>
          <div className="text-xs text-yellow-700">Total Medals</div>
        </div>

        <div className="border rounded-lg p-4 text-center bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 border border-gray-600"></div>
            <span className="text-sm font-medium text-gray-700">Silver</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {totals.silver}
          </div>
          <div className="text-xs text-gray-600">Total Medals</div>
        </div>

        <div className="border rounded-lg p-4 text-center bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border border-amber-900"></div>
            <span className="text-sm font-medium text-amber-800">Bronze</span>
          </div>
          <div className="text-2xl font-bold text-amber-900">
            {totals.bronze}
          </div>
          <div className="text-xs text-amber-700">Total Medals</div>
        </div>

        <div className="border rounded-lg p-4 text-center bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-sm font-medium text-slate-700">Total</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {totals.total}
          </div>
          <div className="text-xs text-slate-600">All Medals</div>
        </div>
      </div>

      {/* AG Grid Table */}
      <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
        <AgGridReact
          rowData={processedData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowClassRules={rowClassRules as unknown as RowClassRules}
          suppressMultiSort={true}
          animateRows={true}
          enableCellTextSelection={true}
          suppressRowClickSelection={true}
          rowSelection="multiple"
          rowMultiSelectWithClick={true}
          suppressMenuHide={false}
          domLayout="normal"
        />
      </div>

      <div className="text-xs text-gray-500 text-center">
        Data sorted by Gold medals (descending), then Silver, then Bronze
      </div>
    </div>
  );
}
