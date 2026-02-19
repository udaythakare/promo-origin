export default function BusinessLoading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                <p className="text-sm text-gray-600">Loading...</p>
            </div>
        </div>
    );
}
