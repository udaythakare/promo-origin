export default function VendorsLoading() {
  return (
    <div className="p-6 animate-pulse">
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-4 w-64 bg-gray-100 rounded mt-3" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border rounded-xl p-5 shadow-sm"
          >
            <div className="h-5 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-100 rounded mt-2" />
            <div className="h-4 w-2/3 bg-gray-100 rounded mt-4" />
            <div className="h-10 bg-gray-200 rounded mt-6" />
          </div>
        ))}
      </div>
    </div>
  );
}
