"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Search, ChevronLeft, ChevronRight } from "lucide-react"
import PaginationInput from "./pagin";


interface DataTableProps {
  data: Record<string, string>[]
  headers: string[]
}

export default function DataTable({ data, headers }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending"
  } | null>(null)

  const [filterColumn, setFilterColumn] = useState<string>("all")
  const [filterValue, setFilterValue] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [goToPage, setGoToPage] = useState("")

  // Sort data
  const sortedData = useMemo(() => {
    const sortableData = [...data]
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }
    return sortableData
  }, [data, sortConfig])

  // Filter data
  const filteredData = useMemo(() => {
    if (!filterValue) return sortedData

    return sortedData.filter((row) => {
      if (filterColumn === "all") {
        // Search in all columns
        return Object.values(row).some((value) => value.toString().toLowerCase().includes(filterValue.toLowerCase()))
      } else {
        // Search in specific column
        const cellValue = row[filterColumn]?.toString().toLowerCase() || ""
        return cellValue.includes(filterValue.toLowerCase())
      }
    })
  }, [sortedData, filterColumn, filterValue])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return filteredData.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredData, currentPage, rowsPerPage])

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const getSortDirection = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null
    }
    return sortConfig.direction
  }


  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number.parseInt(value))
    setCurrentPage(1) // Reset to first page when changing rows per page
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
        <div className="w-full md:w-1/3">
          <label className="text-sm font-medium mb-1 block">Filter Column</label>
          <Select value={filterColumn} onValueChange={setFilterColumn}>
            <SelectTrigger>
              <SelectValue placeholder="Select column" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Columns</SelectItem>
              {headers.map((header) => (
                <SelectItem key={header} value={header}>
                  {header}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-2/3">
          <label className="text-sm font-medium mb-1 block">Filter Value</label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>
      
       {/* Pagination */}
       {filteredData.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between my-4 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="50" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)}{" "}
            of {filteredData.length} entries
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <PaginationInput currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="border rounded-md overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort(header)}
                    className="flex items-center gap-1 p-0 h-auto font-medium"
                  >
                    {header}
                    <ArrowUpDown className="h-4 w-4" />
                    {getSortDirection(header) === "ascending" && " ↑"}
                    {getSortDirection(header) === "descending" && " ↓"}
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header) => (
                    <TableCell key={`${rowIndex}-${header}`}>{row[header]}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={headers.length} className="text-center py-6">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  )
}

