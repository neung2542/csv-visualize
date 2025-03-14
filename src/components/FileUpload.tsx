'use client'
import React, { useState } from 'react';
import { parseCsv } from '../utils/parseCsv';

const FileUpload: React.FC = () => {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: number; direction: 'ascending' | 'descending' } | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const data = parseCsv(text);
        setCsvData(data);
      };
      reader.readAsText(file);
    }
  };

  const handleSort = (columnIndex: number) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === columnIndex && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key: columnIndex, direction });

    const sortedData = [csvData[0], ...csvData.slice(1).sort((a, b) => {
      if (a[columnIndex] < b[columnIndex]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[columnIndex] > b[columnIndex]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    })];
    setCsvData(sortedData);
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {csvData.length > 0 && (
        <table className="table-auto border-collapse border border-gray-400 mt-4">
          <thead>
            <tr>
              {csvData[0].map((header, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(index)}
                  className="cursor-pointer border border-gray-400 px-4 py-2"
                >
                  {header}
                  {sortConfig?.key === index ? (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-gray-400 px-4 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FileUpload;