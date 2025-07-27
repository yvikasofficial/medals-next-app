import MedalsTable from "@/components/medals-table";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <Card className="bg-white/80 backdrop-blur-sm shadow-none">
          <CardContent className="px-4 md:px-6">
            <MedalsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
