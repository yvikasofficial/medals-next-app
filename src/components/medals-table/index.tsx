"use client";

import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { RowClassRules, ICellRendererParams } from "ag-grid-community";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { Medal } from "@/types/medal";
import { createColumnDefinitions } from "./custom-columns";
import MedalSummaryCards from "./medal-summary";
import { useGetMedals } from "@/services/medals/use-get-medals";
import { Button } from "@/components/ui/button";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function MedalsTable() {
  // Use the query hook to fetch medals data
  const { data, isLoading, error, refetch } = useGetMedals();
  const medals = data?.record.medals;

  // Process data to add totals and rankings
  const processedData = useMemo(() => {
    if (!medals) return [];

    const dataWithTotals = medals.map((country: Medal) => ({
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
  }, [medals]);

  // Column definitions
  const columnDefs = useMemo(() => createColumnDefinitions(), []);

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

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-[800px] h-[calc(100vh-100px)] mx-auto space-y-4">
        <div className="flex flex-col justify-center items-center h-full py-20 space-y-6">
          {/* Spinner */}
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>

          {/* Loading Message */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">
              Loading Olympics Data
            </h3>
            <p className="text-gray-600 max-w-md">
              Fetching the latest medal standings from the Olympics...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full max-w-[800px] h-[calc(100vh-100px)] mx-auto">
        <div className="flex flex-col justify-center items-center h-full py-20 space-y-6">
          {/* Error Icon */}
          <div className="text-6xl text-red-500">⚠️</div>

          {/* Error Message */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">
              Unable to load medals data
            </h3>
            <p className="text-gray-600 max-w-md">
              {error.message ||
                "Something went wrong while fetching the Olympics medal data. Please try again."}
            </p>
          </div>

          {/* Retry Button */}
          <Button onClick={() => refetch()} variant="default" className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[800px] mx-auto space-y-4">
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
      <MedalSummaryCards totals={totals} />

      {/* AG Grid Table */}
      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
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
    </div>
  );
}
