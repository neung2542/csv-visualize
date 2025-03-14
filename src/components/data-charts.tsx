"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart } from "@/components/ui/chart";

interface DataChartsProps {
  data: Record<string, string>[];
  headers: string[];
}

export default function DataCharts({ data, headers }: DataChartsProps) {
  const [xAxis, setXAxis] = useState<string>(headers[0] || "");
  const [yAxis, setYAxis] = useState<string>("");
  const [limitedItem, setLimitedItem] = useState<number>(20);

  // Determine which headers might contain numeric data
  const numericHeaders = useMemo(() => {
    return headers.filter((header) => {
      // Check if at least 80% of values in this column are numeric
      const numericCount = data.reduce((count, row) => {
        const value = row[header];
        return !isNaN(Number(value)) ? count + 1 : count;
      }, 0);

      return numericCount / data.length >= 0.8;
    });
  }, [data, headers]);

  // Handle X-Axis change
  const handleXAxisChange = (value: string) => {
    setXAxis(value);

    // If the new X-Axis value is the same as current Y-Axis,
    // select a different column for Y-Axis
    if (value === yAxis) {
      const availableYOptions = numericHeaders.filter((h) => h !== value);
      if (availableYOptions.length > 0) {
        console.log("Setting Y-Axis to", availableYOptions[0]);
        
        setYAxis(availableYOptions[0]);
      }
    }
  };

  // Filter out the X-Axis column from Y-Axis options
  const yAxisOptions = useMemo(() => {
    setYAxis(numericHeaders[0] || "");
    return numericHeaders.filter((header) => header !== xAxis);
  }, [numericHeaders, xAxis]);

  // Prepare data for chart
  const chartData = useMemo(() => {
    const limitedData = data.slice(0, limitedItem);

    // For bar chart
    return limitedData.map((row) => ({
      name: row[xAxis]?.toString() || "",
      value: Number(row[yAxis]) || 0,
    }));
  }, [data, xAxis, yAxis, limitedItem]);

  // Define blue color palette for the chart
  const blueColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart Visualization</CardTitle>
        <CardDescription>Visualize your data with a bar chart</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium mb-1 block">
              X-Axis (Category)
            </label>
            <Select value={xAxis} onValueChange={handleXAxisChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Y-Axis (Value)
            </label>
            <Select
              value={yAxisOptions[0]}
              onValueChange={setYAxis}
              disabled={yAxisOptions.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {yAxisOptions.length > 0 ? (
                  yAxisOptions.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No numeric columns available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
              <label className="text-sm font-medium mb-1 block">
                Limit Items
              </label>
              <Select
                value={limitedItem.toString()}
                onValueChange={(value) => setLimitedItem(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={limitedItem.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value={data.length.toString()}>
                    {data.length}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
        </div>

        <div className="h-[400px] w-full">
          <BarChart
            data={chartData}
            index="name"
            categories={["value"]}
            colors={blueColors}
            valueFormatter={(value) => value.toString()}
            yAxisWidth={60}
          />
        </div>
      </CardContent>
    </Card>
  );
}
