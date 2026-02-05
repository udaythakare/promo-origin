// app/investors/components/StatCard.jsx

export default function StatCard({ title, value, change, icon }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm flex justify-between items-start">
      
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold mt-1">{value}</h2>

        {change && (
          <p className="text-sm text-green-600 mt-2">
            ↑ {change}
          </p>
        )}
      </div>

      <div className="bg-green-100 p-3 rounded-lg">
        {icon}
      </div>

    </div>
  );
}
