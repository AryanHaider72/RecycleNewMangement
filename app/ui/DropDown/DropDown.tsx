import React, { useEffect, useRef, useState } from "react";

interface OptionType {
  id: string;
  label: string;
  value: string;
}

interface Props {
  label?: string;
  value: string;
  options: OptionType[];
  placeholder?: string;
  required?: boolean;
  onChange: (id: string) => void;
  filedID: (ID: string) => void;
}

export default function DropDownList({
  label,
  value,
  options,
  placeholder,
  required,
  onChange,
  filedID,
}: Props) {
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // FILTER LIST
  const filteredOptions = options.filter((item) =>
    item.label.toLowerCase().includes(value.toLowerCase()),
  );

  // CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // RESET refs when list changes
  useEffect(() => {
    itemRefs.current = [];
    setHighlightIndex(-1);
  }, [value]);

  // AUTO SCROLL FOLLOW HIGHLIGHT
  useEffect(() => {
    if (highlightIndex >= 0 && itemRefs.current[highlightIndex]) {
      itemRefs.current[highlightIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightIndex]);

  // SELECT ITEM
  const handleSelect = (item: OptionType) => {
    filedID(item.id);
    onChange(item.value);
    setOpen(false);
  };

  // KEYBOARD CONTROL
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || filteredOptions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev + 1 >= filteredOptions.length ? 0 : prev + 1,
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev <= 0 ? filteredOptions.length - 1 : prev - 1,
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0) {
        handleSelect(filteredOptions[highlightIndex]);
      }
    }

    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* INPUT */}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          const value = e.target.value;
          const data = options.find((item) => item.value === value);
          if (data) {
            filedID(data.id);
          }
          onChange(e.target.value);
          setOpen(true);
          setHighlightIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2 border border-gray-200 shadow-sm  rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {/* DROPDOWN */}
      {open && (
        <ul className="absolute z-50 w-full bg-white  rounded-lg mt-1 shadow max-h-52 overflow-auto">
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-2 text-gray-500">No Record Found</li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                onMouseDown={() => handleSelect(option)}
                className={`px-4 py-2 cursor-pointer transition ${
                  index === highlightIndex
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-50"
                }`}
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
