"use client";
import { Suspense } from "react";
import MedalsTable from "@/components/medals-table";
import { Card, CardContent } from "@/components/ui/card";

function MedalsTableFallback() {
  return (
    <div className="w-full max-w-[800px] h-[400px] mx-auto">
      <div className="flex flex-col justify-center items-center h-full py-20 space-y-6">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">
            Loading Olympics Data
          </h3>
          <p className="text-gray-600 max-w-md">
            Preparing the medal standings...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[900px] w-full mx-auto px-6 pt-4">
        <Card className="bg-white/80 backdrop-blur-sm shadow-none">
          <CardContent className="px-4 md:px-6">
            <Suspense fallback={<MedalsTableFallback />}>
              <MedalsTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
