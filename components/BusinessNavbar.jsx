'use client';

import { Bell } from 'lucide-react';
import InternalNotifications from './InternalNotifications';

const BusinessNavbar = ({userId}) => {
  return (
    <nav className="bg-white border-b-4 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Business
          </h1>
          
          <div className="relative">
            <div
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              aria-label="Notifications"
            >
              {/* <Bell className="w-5 h-5 sm:w-6 sm:h-6" /> */}
              <InternalNotifications userId={userId} />
            </div>
            {/* You can add a notification badge here if needed */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BusinessNavbar; 