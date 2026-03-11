'use client';

import { useLanguage } from '@/context/LanguageContext';

/**
 * ResultDisplay
 * Displays the scanned QR result with copy functionality
 */

const ResultDisplay = ({ result }) => {

    const { t } = useLanguage();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
    };

    return (
        <div className="mt-6 p-5 w-full bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">

            <h3 className="text-xl font-black mb-2">
                {t?.scanner?.scannedResult ?? "Scanned Result"}
            </h3>

            <p className="break-all font-semibold text-lg">
                {result}
            </p>

            {/* Action Buttons */}

            <div className="mt-4 flex justify-end">

                <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-[#df6824] text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                    {t?.scanner?.copy ?? "COPY"}
                </button>

            </div>

        </div>
    );
};

export default ResultDisplay;