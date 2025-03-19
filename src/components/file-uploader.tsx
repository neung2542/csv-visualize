"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Upload, FileWarning, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DataTable from "./data-table";
import Papa from "papaparse";
import DataCharts from "./data-charts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import { useToast } from "@/hooks/use-toast"
// import DataPreview from "./data-preview"

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState<any[] | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [visibleRows, setVisibleRows] = useState<number>(0);
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setVisibleRows(0);

    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      setIsLoading(false);
      return;
    }

    setFile(file);

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        delimiter: ",",
        complete: (results: { data: any; errors: any }) => {
          const { data, errors } = results;
          if (errors.length) {
            console.error("Error parsing CSV:", errors);
            setError("Failed to parse CSV file. Please check the format.");
            setIsLoading(false);
            return;
          }

          const headers = Object.keys(data[0]);
          setHeaders(headers);
          setCsvData(data);
        },
      });
    } catch (error) {
      console.error("Error reading file:", error);
      setError("Failed to read the file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleFile = async () => {
    setIsLoading(true);
    setError(null);
    setVisibleRows(0);

    try {
      const response = await fetch("/sample_data.csv");
      const text = await response.text();
      setFile(new File([text], "sample_data.csv"));

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        delimiter: ",",
        complete: (results: { data: any; errors: any }) => {
          const { data, errors } = results;
          if (errors.length) {
            console.error("Error parsing CSV:", errors);
            setError("Failed to parse sample CSV file. Please check the format.");
            setIsLoading(false);
            return;
          }

          const headers = Object.keys(data[0]);
          setHeaders(headers);
          setCsvData(data);
          console.log(data);
          
        },
      });
    } catch (error) {
      console.error("Error fetching sample file:", error);
      setError("Failed to fetch the sample file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (csvData && csvData.length > 0) {
      let rowIndex = 0;
      const interval = setInterval(() => {
        setVisibleRows((prev) => prev + 1);
        rowIndex++;
        if (rowIndex >= 10 || rowIndex >= csvData.length) {
          clearInterval(interval);
        }
      }, 300); // 300ms delay for each row
      return () => clearInterval(interval);
    }
  }, [csvData]);

  return (
    <div className="w-full">
      <div className={"text-center flex justify-center mb-8"}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept=".csv"
          className="hidden"
        />
        <Button
          variant="secondary"
          type="button"
          className="flex items-center justify-center cursor-pointer"
          size="lg"
          // onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          Select CSV File
        </Button>
      </div>
      <p className="text-center text-muted-foreground mb-8">Or</p>
      <div className="flex justify-center items-center">
        <div
          className="text-muted-foreground cursor-pointer"
          onClick={handleSampleFile}
        >
          Use Sample CSV
        </div>
      </div>
      {file && (
        <div className="md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{file.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Processing file...</span>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 p-4 rounded-md flex items-start">
              <FileWarning className="h-5 w-5 text-destructive mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-destructive">Error</h4>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : csvData ? (
            <div>
              <h3 className="font-medium mb-2">Preview</h3>
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr>
                      {headers.map((header) => (
                        <th
                          key={header}
                          className="border-b px-4 py-2 text-left"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 10).map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={`transition-opacity duration-500 ${
                          rowIndex < visibleRows ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {headers.map((header) => (
                          <td
                            key={header}
                            className="border-b px-4 py-2 text-left"
                          >
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8">
                <Tabs defaultValue="table">
                  <div>
                    {headers.length > 1 && (
                      <DataCharts
                        key={file.name}
                        data={csvData}
                        headers={headers}
                      />
                    )}
                  </div>
                  <TabsContent value="table" className="mt-4">
                    <DataTable data={csvData} headers={headers} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
