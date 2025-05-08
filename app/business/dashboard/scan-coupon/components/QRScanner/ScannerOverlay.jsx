// components/QRScanner/ScannerOverlay.jsx
const ScannerOverlay = () => {
    return (
        <div className="absolute inset-0 border-2 border-white opacity-50 pointer-events-none">
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-blue-500"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-blue-500"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-blue-500"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-blue-500"></div>
        </div>
    );
};

export default ScannerOverlay;





