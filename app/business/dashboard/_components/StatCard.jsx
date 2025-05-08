import {
    FiUsers,
    FiMenu,
    FiBell,
    FiSearch,
    FiMoreVertical,
    FiTrendingUp,
    FiDollarSign,
    FiShoppingCart,
    FiEye,
    FiCalendar
} from 'react-icons/fi'

const StatCard = ({ icon, title, value, trend, color }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    {icon}
                </div>
                <div className={`flex items-center ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <FiTrendingUp className={trend < 0 ? 'transform rotate-180' : ''} />
                    <span className="ml-1 text-sm font-medium">{Math.abs(trend)}%</span>
                </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
    )
}

export default StatCard;