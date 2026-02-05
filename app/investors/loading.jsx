export default function InvestorLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
