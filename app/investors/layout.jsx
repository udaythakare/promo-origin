// app/investors/layout.jsx

import Sidebar from "./components/Sidebar";

export default function InvestorLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <main className="flex-1 p-6">
        {children}
      </main>

    </div>
  );
}
