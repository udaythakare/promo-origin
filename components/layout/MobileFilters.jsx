import { useState, useEffect, useRef } from "react";
import { Filter } from "lucide-react";

export default function MobileFilters({
  categories = [],
  selectedCategory = "",
  handleCategoryChange,
  radius,
  handleRadiusChange,
  initialLoading = false,
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryDrawer, setShowCategoryDrawer] = useState(false);
  const [showDistanceDrawer, setShowDistanceDrawer] = useState(false);
  const filtersRef = useRef(null);
  const filterButtonRef = useRef(null);

  useEffect(() => {
    if (selectedCategory === "" && !initialLoading) {
      handleCategoryChange({ target: { value: "" } });
    }
    if (!radius && !initialLoading) {
      handleRadiusChange({ target: { value: 1 } });
    }
  }, []);

  // Close filters dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showFilters &&
        filtersRef.current &&
        !filtersRef.current.contains(event.target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target)
      ) {
        setShowFilters(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  const distances = [
    { value: 1, label: "1 km" },
    { value: 5, label: "5 km" },
    { value: 10, label: "10 km" },
    { value: 25, label: "25 km" },
    { value: 50, label: "50 km" },
    { value: 500, label: "500 km" },
  ];

  const selectedCategoryName =
    categories.find((cat) => cat.id === selectedCategory)?.name || "All";

  const selectedDistanceLabel =
    distances.find((d) => d.value == radius)?.label || "1 km";

  // Handler for clicking outside drawers
  const handleOutsideClick = (e, setStateFunction) => {
    if (e.target === e.currentTarget) {
      setStateFunction(false);
    }
  };

  return (
    <div className="relative h-full flex flex-col ">
      {/* Header with Filter Icon */}
      <header className="bg-white p-4 shadow-sm flex justify-between items-center border-b border-gray-300"> 
        <h1 className="text-lg font-semibold">Promo App</h1>
        <button
          ref={filterButtonRef}
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Filter size={20} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1  bg-gray-50">
        {/* Your main app content goes here */}
        {showFilters && (
          <div
            ref={filtersRef}
            className="fixed top-16 border border-gray-200 right-4 z-40 bg-white shadow-lg rounded-lg p-4 w-48 transition-all duration-300 ease-in-out"
          >
            <div className="flex flex-col gap-3">
              {/* Category Button */}
              <button
                onClick={() => {
                  setShowCategoryDrawer(true);
                  setShowFilters(false);
                }}
                className="w-full p-2 bg-gray-100 rounded-md text-left flex justify-between items-center"
              >
                <span>Category</span>
                <span className="text-gray-600 text-sm">
                  {selectedCategoryName}
                </span>
              </button>

              {/* Distance Button */}
              <button
                onClick={() => {
                  setShowDistanceDrawer(true);
                  setShowFilters(false);
                }}
                className="w-full p-2 bg-gray-100 rounded-md text-left flex justify-between items-center"
              >
                <span>Distance</span>
                <span className="text-gray-600 text-sm">
                  {selectedDistanceLabel}
                </span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Category Selection Drawer with transition */}
      {showCategoryDrawer && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col transition-opacity duration-300"
          onClick={(e) => handleOutsideClick(e, setShowCategoryDrawer)}
        >
          <div className="bg-white rounded-t-xl relative mt-auto max-h-[80%] overflow-y-auto transform transition-transform duration-300 ease-out">
            <div className="p-4 border-b border-gray-300 flex justify-between items-center sticky top-0 bg-white ">
              <h2 className="text-lg font-semibold">Select Category</h2>
              <button
                onClick={() => setShowCategoryDrawer(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-2">
              <div
                onClick={() => {
                  handleCategoryChange({ target: { value: "" } });
                  setShowCategoryDrawer(false);
                }}
                className={`p-3 rounded-md text-center cursor-pointer ${
                  selectedCategory === ""
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100"
                }`}
              >
                All
              </div>
              {categories
                .filter((cat) => cat.id !== "")
                .map(({ id, name }) => (
                  <div
                    key={id}
                    onClick={() => {
                      handleCategoryChange({ target: { value: id } });
                      setShowCategoryDrawer(false);
                    }}
                    className={`p-3 rounded-md text-center cursor-pointer ${
                      selectedCategory === id
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100"
                    }`}
                  >
                    {name}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Distance Selection Drawer with transition */}
      {showDistanceDrawer && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col transition-opacity duration-300"
          onClick={(e) => handleOutsideClick(e, setShowDistanceDrawer)}
        >
          <div className="bg-white rounded-t-xl mt-auto max-h-[80%] overflow-y-auto transform transition-transform duration-300 ease-out">
            <div className="p-4 border-b border-gray-300 flex justify-between items-center sticky top-0 bg-white ">
              <h2 className="text-lg font-semibold">Select Distance</h2>
              <button
                onClick={() => setShowDistanceDrawer(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-2">
              {distances.map(({ value, label }) => (
                <div
                  key={value}
                  onClick={() => {
                    handleRadiusChange({ target: { value } });
                    setShowDistanceDrawer(false);
                  }}
                  className={`p-3 rounded-md text-center cursor-pointer ${
                    radius == value
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100"
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
