export default function InvestorLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8 space-y-10">

      {/* Page Title Skeleton */}
      <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-white rounded-xl shadow-sm border p-4 animate-pulse"
          >
            <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
            <div className="h-6 w-16 bg-gray-300 rounded" />
          </div>
        ))}
      </div>

      {/* Chart Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Bar / Pie Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
          <div className="h-5 w-40 bg-gray-200 rounded mb-6" />
          <div className="h-64 bg-gray-100 rounded-lg" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
          <div className="h-5 w-40 bg-gray-200 rounded mb-6" />
          <div className="h-64 bg-gray-100 rounded-lg" />
        </div>
      </div>

      {/* Line Chart Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
        <div className="h-5 w-48 bg-gray-200 rounded mb-6" />
        <div className="h-72 bg-gray-100 rounded-lg" />
      </div>

    </div>
  );
}
