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
      <main className="flex-1 overflow-y-auto">

        {/* Page Container */}
        <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 pb-24 lg:pb-8 max-w-7xl mx-auto">
          {children}
        </div>

      </main>
    </div>
  );
}
