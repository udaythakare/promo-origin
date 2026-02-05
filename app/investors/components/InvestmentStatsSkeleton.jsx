export default function InvestmentStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-4 border rounded-lg animate-pulse"
        >
          <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
          <div className="h-6 w-32 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  );
}
