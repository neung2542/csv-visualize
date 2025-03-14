'use client'
import React, { useState, useRef, ChangeEvent, KeyboardEvent, FocusEvent } from 'react';
import { Input } from "@/components/ui/input"

interface PaginationInputProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationInput: React.FC<PaginationInputProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const [inputValue, setInputValue] = useState<string>(currentPage.toString());
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    validateAndUpdatePage();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      validateAndUpdatePage();
      inputRef.current?.blur();
    }
  };

  const validateAndUpdatePage = () => {
    const newPage = parseInt(inputValue);
    
    // Check if input is a valid number and within range
    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    } else {
      // Reset to current page if invalid
      setInputValue(currentPage.toString());
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Select all text when focused
    inputRef.current?.select();
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="text"
        className="w-8 h-8 border rounded-md text-center"
        value={isFocused ? inputValue : currentPage.toString()}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        aria-label="Page number"
      />
      <span className="text-sm text-muted-foreground">of {totalPages}</span>
    </div>
  );
};

export default PaginationInput;