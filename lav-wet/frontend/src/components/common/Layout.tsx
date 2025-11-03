import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 lg:ml-0 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-6 lg:p-8 pt-16 lg:pt-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;