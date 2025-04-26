import React from "react";
import { X } from "lucide-react";

export default function SelectedFilters({
  categories = [],
  selectedCategory = "",
  radius,
  handleCategoryChange,
  handleRadiusChange,
  showClearAll = true,
}) {
  const selectedCategoryObject = categories.find((cat) => cat.id === selectedCategory);
  const selectedCategoryName = selectedCategoryObject?.name || "All";
  
  const distances = [
    { value: 1, label: "1 km" },
    { value: 5, label: "5 km" },
    { value: 10, label: "10 km" },
    { value: 25, label: "25 km" },
    { value: 50, label: "50 km" },
    { value: 500, label: "500 km" },
  ];
  
  const selectedDistanceLabel = distances.find((d) => d.value == radius)?.label || "1 km";
  
  const hasActiveFilters = selectedCategory !== "" || radius !== 1;
  
  const clearAllFilters = () => {
    handleCategoryChange({ target: { value: "" } });
    handleRadiusChange({ target: { value: 1 } });
  };

  return (
    <div className="w-full ">
      {hasActiveFilters ? (
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap items-center gap-2">
            {/* Header with filter count */}
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-sm font-medium text-gray-700">Active Filters</span>
              {showClearAll && (
                <button 
                  onClick={clearAllFilters}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>
            
            {/* Category chip */}
            {selectedCategory !== "" && (
              <div className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                <span className="mr-1">Category: {selectedCategoryName}</span>
                <button 
                  onClick={() => handleCategoryChange({ target: { value: "" } })}
                  className="ml-1 p-0.5 rounded-full hover:bg-blue-200"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            
            {/* Distance chip (only show if not default) */}
            {radius !== 1 && (
              <div className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                <span className="mr-1">Distance: {selectedDistanceLabel}</span>
                <button 
                  onClick={() => handleRadiusChange({ target: { value: 1 } })}
                  className="ml-1 p-0.5 rounded-full hover:bg-blue-200"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500 py-2">No filters applied</div>
      )}
    </div>
  );
}