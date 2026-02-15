export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">

        {/* Animated Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Loading Text */}
        <p className="text-lg font-semibold text-gray-700 animate-pulse">
          Loading analytics...
        </p>

      </div>
    </div>
  );
}
