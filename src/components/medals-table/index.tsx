"use client";

import React, { useMemo, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import {
  RowClassRules,
  ICellRendererParams,
  SortChangedEvent,
} from "ag-grid-community";
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

  // Routing hooks
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const sortParam = searchParams.get("sort");
  const directionParam = searchParams.get("direction") || "desc";

  // Grid reference for programmatic control
  const gridRef = useRef<AgGridReact>(null);

  // Update URL when sort parameter changes
  const updateSortParam = useCallback(
    (newSort: string | null, newDirection: string | null = "desc") => {
      const params = new URLSearchParams(searchParams.toString());

      if (newSort && newSort !== "default") {
        params.set("sort", newSort);
        params.set("direction", newDirection || "desc");
      } else {
        // Set to default (gold medal sorting) instead of deleting
        params.set("sort", "default");
        params.set("direction", "desc");
      }

      const newUrl = `${pathname}?${params.toString()}`;
      router.replace(newUrl, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  // Handle AG Grid sort changes
  const onSortChanged = useCallback(
    (event: SortChangedEvent) => {
      const sortModel = event.api.getColumnState();
      const sortableColumns = sortModel.filter(
        (col) => col.sort && col.colId !== "rank"
      );

      if (sortableColumns.length === 0) {
        updateSortParam("default", "desc");
      } else {
        const sort = sortableColumns[0];

        // Check if this is the default Olympic sorting (gold descending)
        // and the current URL param is "default" or missing
        const isDefaultSort = sort.colId === "gold" && sort.sort === "desc";
        const currentSortParam = searchParams.get("sort");
        const isCurrentlyDefault =
          !currentSortParam || currentSortParam === "default";

        if (isDefaultSort && isCurrentlyDefault) {
          // Keep it as "default" instead of changing to "gold"
          updateSortParam("default", "desc");
        } else {
          updateSortParam(sort.colId, sort.sort || "desc");
        }
      }

      // Remove the updateRanks() call to keep ranking static
    },
    [updateSortParam, searchParams]
  );

  // Remove the updateRanks function entirely since we want static ranking

  // Process data with Olympic ranking criteria (Gold -> Silver -> Bronze)
  const processedData = useMemo(() => {
    if (!medals) return [];

    // Add totals and sort by Olympic criteria
    const medalsWithTotals = medals.map((country: Medal) => ({
      ...country,
      total: country.gold + country.silver + country.bronze,
    }));

    // Sort by Olympic criteria: Gold (desc) -> Silver (desc) -> Bronze (desc)
    const sortedMedals = medalsWithTotals.sort((a, b) => {
      // Primary: Gold medals (descending)
      if (a.gold !== b.gold) {
        return b.gold - a.gold;
      }
      // Secondary: Silver medals (descending)
      if (a.silver !== b.silver) {
        return b.silver - a.silver;
      }
      // Tertiary: Bronze medals (descending)
      if (a.bronze !== b.bronze) {
        return b.bronze - a.bronze;
      }
      // If all medals are equal, maintain original order
      return 0;
    });

    // Assign ranks based on Olympic sorting
    return sortedMedals.map((country, index) => ({
      ...country,
      rank: index + 1,
    }));
  }, [medals]);

  // Column definitions with initial sort state
  const columnDefs = useMemo(() => {
    const columns = createColumnDefinitions();

    // Clear any default sort
    columns.forEach((col) => {
      delete col.sort;
    });

    // Set default sort to gold when sort parameter is "default" or not present
    if (sortParam && sortParam !== "rank" && sortParam !== "default") {
      const sortColumn = columns.find((col) => col.field === sortParam);
      if (sortColumn && sortColumn.field !== "rank") {
        sortColumn.sort = directionParam as "asc" | "desc";
      }
    } else {
      // Default to gold medal sorting (descending) when sort is "default" or not present
      const goldColumn = columns.find((col) => col.field === "gold");
      if (goldColumn) {
        goldColumn.sort = "desc";
      }
    }

    return columns;
  }, [sortParam, directionParam]);

  // Grid options
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
    }),
    []
  );

  // Custom comparator for proper medal sorting with tie-breaking
  const medalComparator = useCallback(
    (
      valueA: number,
      valueB: number,
      nodeA: { data: Medal },
      nodeB: { data: Medal }
    ) => {
      // Primary comparison - only compare the actual column values
      if (valueA !== valueB) {
        return valueA - valueB;
      }

      // Only use tie-breaking when the primary values are equal
      // And only if we're not sorting by gold (to prevent interference)
      const currentSort = gridRef.current?.api
        ?.getColumnState()
        ?.find((col) => col.sort)?.colId;

      if (currentSort !== "gold" && nodeA.data.gold !== nodeB.data.gold) {
        return nodeA.data.gold - nodeB.data.gold;
      }
      if (currentSort !== "silver" && nodeA.data.silver !== nodeB.data.silver) {
        return nodeA.data.silver - nodeB.data.silver;
      }
      if (currentSort !== "bronze" && nodeA.data.bronze !== nodeB.data.bronze) {
        return nodeA.data.bronze - nodeB.data.bronze;
      }
      // Remove total comparison since it's not part of the Medal type

      return 0;
    },
    []
  );

  // Enhanced column definitions with custom comparators
  const enhancedColumnDefs = useMemo(() => {
    return columnDefs.map((col) => {
      if (
        col.field &&
        ["gold", "silver", "bronze", "total"].includes(col.field)
      ) {
        return {
          ...col,
          comparator: medalComparator,
        };
      }
      return col;
    });
  }, [columnDefs, medalComparator]);

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

  // Grid ready callback - remove rank updating to keep static ranking
  const onGridReady = useCallback(() => {
    // Ranks will remain as initially set in processedData
  }, []);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-[800px] h-[calc(100vh-100px)] mx-auto space-y-4">
        <div className="flex flex-col justify-center items-center h-full py-20 space-y-6">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
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
          <div className="text-6xl text-red-500">⚠️</div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">
              Unable to load medals data
            </h3>
            <p className="text-gray-600 max-w-md">
              {error.message ||
                "Something went wrong while fetching the Olympics medal data. Please try again."}
            </p>
          </div>
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

      <MedalSummaryCards totals={totals} />

      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={processedData}
          columnDefs={enhancedColumnDefs}
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
          onSortChanged={onSortChanged}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}
