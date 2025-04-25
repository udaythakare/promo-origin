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


const RecentCouponsTable = () => {
    const coupons = [
        { id: 1, code: 'SUMMER25', discount: '25%', type: 'Percentage', used: 543, status: 'Active', expires: '2025-06-15' },
        { id: 2, code: 'FREESHIP', discount: '$0', type: 'Free Shipping', used: 871, status: 'Active', expires: '2025-05-30' },
        { id: 3, code: 'SAVE10NOW', discount: '$10', type: 'Fixed Amount', used: 329, status: 'Active', expires: '2025-05-10' },
        { id: 4, code: 'WELCOME15', discount: '15%', type: 'Percentage', used: 217, status: 'Inactive', expires: '2025-04-01' },
    ]

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Coupons</h3>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Used</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {coupons.map((coupon) => (
                            <tr key={coupon.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{coupon.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.discount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.used}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${coupon.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {coupon.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.expires}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                    <button className="text-gray-600 hover:text-gray-900">
                                        <FiMoreVertical />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RecentCouponsTable;