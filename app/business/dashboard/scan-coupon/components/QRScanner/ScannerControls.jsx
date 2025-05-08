import { X, Camera } from 'lucide-react';

const ScannerControls = ({ onClose, onFlip }) => {
    return (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
            <button
                onClick={onClose}
                className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                aria-label="Close scanner"
            >
                <X size={24} />
            </button>

            <button
                onClick={onFlip}
                className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors"
                aria-label="Switch camera"
            >
                <Camera size={24} />
            </button>
        </div>
    );
};

export default ScannerControls;