// Pagination.tsx - Neo-Brutalism style
'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Pagination({
    totalPages,
    currentPage,
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const createPageURL = (pageNumber) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const handlePageChange = (pageNumber) => {
        replace(createPageURL(pageNumber));
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <div className="flex justify-center">
            <nav className="inline-flex">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className={`px-4 py-2 border-4 border-black font-bold ${currentPage <= 1
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-purple-400 text-black hover:bg-purple-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all'
                        }`}
                >
                    PREV
                </button>

                <div className="hidden sm:flex">
                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 border-t-4 border-b-4 border-r-4 border-black font-bold ${currentPage === page
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-purple-200 text-black hover:bg-purple-300'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <div className="flex sm:hidden items-center px-4 py-2 border-t-4 border-b-4 border-r-4 border-black bg-purple-200 font-bold">
                    {currentPage} / {totalPages}
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className={`px-4 py-2 border-4 border-black font-bold ${currentPage >= totalPages
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-purple-400 text-black hover:bg-purple-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all'
                        }`}
                >
                    NEXT
                </button>
            </nav>
        </div>
    );
}