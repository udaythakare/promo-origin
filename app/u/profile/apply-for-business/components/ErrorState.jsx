export function ErrorState({ error }) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md mx-auto p-6"
            >
                <div className="bg-red-100 border-4 border-red-500 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-red-700 mb-4">Error Loading Form</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-500 text-white px-6 py-2 font-bold border-2 border-black hover:bg-red-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </motion.div>
        </div>
    );
}