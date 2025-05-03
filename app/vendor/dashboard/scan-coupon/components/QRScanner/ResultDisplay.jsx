// components/QRScanner/ResultDisplay.jsx
const ResultDisplay = ({ result }) => {
    return (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg w-full">
            <h3 className="font-semibold">Scanned Result:</h3>
            <p className="break-all">{result}</p>

            {/* Add action buttons for the result if needed */}
            <div className="mt-2 flex justify-end">
                <button
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                >
                    Copy
                </button>
            </div>
        </div>
    );
};

export default ResultDisplay;