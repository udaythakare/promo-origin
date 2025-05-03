// app/vendors/onboard/layout.jsx
export default function VendorOnboardingLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <main className="container mx-auto py-8">
                {children}
            </main>
        </div>
    );
}