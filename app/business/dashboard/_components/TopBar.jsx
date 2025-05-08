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


const TopBar = ({ toggleSidebar }) => {
    return (
        <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center">
                <button
                    className="mr-4 text-gray-500 md:hidden"
                    onClick={toggleSidebar}
                >
                    <FiMenu size={24} />
                </button>
                <h2 className="text-xl font-semibold text-gray-800">Vendor Dashboard</h2>
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>

                <button className="relative text-gray-500 hover:text-blue-600">
                    <FiBell size={22} />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </button>

                <button className="text-gray-500 hover:text-blue-600 md:hidden">
                    <FiSearch size={22} />
                </button>
            </div>
        </header>
    )
}


export default TopBar;