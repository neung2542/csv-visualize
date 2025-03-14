import Image from "next/image";
import FileUploader from '../components/file-uploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-center">CSV Visualizer</h1>
        {/* <ThemeToggle /> */}
      </div>
      <p className="text-center text-muted-foreground mb-8">Upload a CSV file to visualize and analyze your data</p>

      <div className="max-w-8xl mx-auto">
        <FileUploader />

        <Suspense
          fallback={
            <div className="mt-8">
              <Skeleton className="h-[400px] w-full" />
            </div>
          }
        >
          {/* <Tabs defaultValue="table" className="mt-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table">Data Table</TabsTrigger>
              <TabsTrigger value="chart">Charts</TabsTrigger>
            </TabsList>
            <TabsContent value="table" className="mt-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="text-lg font-medium mb-4">Data Table</h3>
                <p className="text-muted-foreground">Upload a CSV file to view the data table.</p>
              </div>
            </TabsContent>
            <TabsContent value="chart" className="mt-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="text-lg font-medium mb-4">Data Visualization</h3>
                <p className="text-muted-foreground">Upload a CSV file to view charts and visualizations.</p>
              </div>
            </TabsContent>
          </Tabs> */}
        </Suspense>
      </div>
    </main>
  );
}