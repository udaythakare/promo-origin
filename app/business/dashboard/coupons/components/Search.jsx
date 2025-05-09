// Search.tsx - Neo-Brutalism style
'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function Search({ placeholder }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative w-full">
            <input
                className="w-full px-4 py-3 border-3 border-black bg-white text-black font-medium focus:outline-none focus:ring-0 uppercase"
                placeholder={placeholder}
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('query')?.toString()}
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-2xl">
                🔍
            </span>
        </div>
    );
}