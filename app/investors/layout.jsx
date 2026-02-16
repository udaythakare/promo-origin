import Sidebar from "./components/Sidebar";
import InvestorNotificationBell from "./components/InvestorNotificationBell";
import { getUserId } from "@/helpers/userHelper";

export default async function InvestorLayout({ children }) {
  const userId = await getUserId();

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1">

        {/* Top Header */}
        <div className="flex justify-end items-center h-16 px-6 bg-white shadow-sm">
          <InvestorNotificationBell userId={userId} />
        </div>

        {/* Page Container */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
          {children}
        </div>

      </main>
    </div>
  );
}
