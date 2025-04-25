export default function FilterBar({ categories, areas, filters, onFilterChange }) {
    return (
        <div className="bg-white shadow rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input */}
                <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                        Search
                    </label>
                    <input
                        type="text"
                        id="search"
                        className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search coupons..."
                        value={filters.searchTerm}
                        onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
                    />
                </div>

                {/* Category Filter */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Food Category
                    </label>
                    <select
                        id="category"
                        className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={filters.category}
                        onChange={(e) => onFilterChange({ category: e.target.value })}
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Area Filter */}
                <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                    </label>
                    <select
                        id="area"
                        className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={filters.area}
                        onChange={(e) => onFilterChange({ area: e.target.value })}
                    >
                        <option value="">All Locations</option>
                        {areas.map((area) => (
                            <option key={area} value={area}>
                                {area}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}