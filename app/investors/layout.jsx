// app/investors/layout.jsx

import Sidebar from "./components/Sidebar";

export default function InvestorLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1">

        {/* Top spacing for mobile header (because sidebar has mobile header) */}
        <div className="lg:hidden h-16"></div>

        {/* Page Container */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
          {children}
        </div>

      </main>
    </div>
  );
}
