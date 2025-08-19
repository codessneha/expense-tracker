import React, { useContext } from 'react';
import Navbar from './Navbar';
import SideMenu from './SideMenu';
import { UserContext } from '../../context/userContext';

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext);
    
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            {user && (
                <div className="hidden md:block">
                    <SideMenu activeMenu={activeMenu} />
                </div>
            )}
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar activeMenu={activeMenu} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto pt-20 md:pt-4 md:ml-64 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;