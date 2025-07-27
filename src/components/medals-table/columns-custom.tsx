"use client";

import React, { useState, useEffect } from "react";
import { ICellRendererParams, IHeaderParams, ColDef } from "ag-grid-community";
import { getFlagByCode } from "@/lib/get-flag-by-code";

export interface MedalData {
  code: string;
  gold: number;
  silver: number;
  bronze: number;
  total?: number;
  rank?: number;
}

// Medal type configurations
export const medalConfigs = {
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
export const MedalCellRenderer = (params: ICellRendererParams) => {
  return (
    <div className="px-2 py-1 text-center font-semibold">{params.value}</div>
  );
};

// Simple country code cell renderer
export const CountryCellRenderer = (params: ICellRendererParams) => {
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
export const RankCellRenderer = (params: ICellRendererParams) => {
  return <div className="text-center">#{params.value}</div>;
};

// Simplified reusable header renderer for all medal types
export const MedalHeaderRenderer = (medalType: keyof typeof medalConfigs) => {
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

// Column definitions factory
export const createColumnDefinitions = (): ColDef[] => [
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
  },
  {
    field: "silver",
    headerName: "Silver",
    headerComponent: MedalHeaderRenderer("silver"),
    cellRenderer: MedalCellRenderer,
    sortable: true,
    width: 120,
    type: "numericColumn",
  },
  {
    field: "bronze",
    headerName: "Bronze",
    headerComponent: MedalHeaderRenderer("bronze"),
    cellRenderer: MedalCellRenderer,
    sortable: true,
    width: 120,
    type: "numericColumn",
  },
  {
    field: "total",
    headerName: "Total",
    headerComponent: MedalHeaderRenderer("total"),
    cellRenderer: MedalCellRenderer,
    sortable: true,
    width: 120,
    type: "numericColumn",
  },
];
