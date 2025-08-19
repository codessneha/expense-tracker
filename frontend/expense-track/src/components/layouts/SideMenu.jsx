import React from 'react';
import { SIDE_MENU_DATA, ICON_NAMES } from '../../utils/data';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { 
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut 
} from 'react-icons/lu';

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();
    
    const handleClick = (route) => {
        if (route === "/logout") {
            handleLogout();
            return;
        }
        navigate(route);
    };

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate('/login');
    };
    
    return (
        <div className="w-64 h-screen bg-white border-r border-gray-200 p-6 flex flex-col fixed left-0 top-0 pt-20 overflow-y-auto">
            {/* User Profile */}
            <div className="flex flex-col items-center pb-8 border-b border-gray-100 mb-6">
                <div className="relative mb-3">
                    <img
                        src={user?.profileImageUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.fullName || "User")}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border-2 border-violet-100"
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}`;
                        }}
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                    {user?.fullName || "Welcome User"}
                </h3>
                <p className="text-sm text-gray-500">Premium Member</p>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2 mt 2">
                {SIDE_MENU_DATA.map((item) => {
                    const getIcon = () => {
                        const iconClass = `text-xl ${activeMenu === item.label ? 'text-white' : 'text-gray-500'}`;
                        switch(item.icon) {
                            case ICON_NAMES.DASHBOARD:
                                return <LuLayoutDashboard className={iconClass} />;
                            case ICON_NAMES.INCOME:
                                return <LuWalletMinimal className={iconClass} />;
                            case ICON_NAMES.EXPENSE:
                                return <LuHandCoins className={iconClass} />;
                            case ICON_NAMES.LOGOUT:
                                return <LuLogOut className={iconClass} />;
                            default:
                                return null;
                        }
                    };

                    return (
                        <div
                            key={item.id}
                            className={`group flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
                                activeMenu === item.label 
                                    ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-100' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-violet-600'
                            }`}
                            onClick={() => handleClick(item.path)}
                        >
                            <div className={`p-2 rounded-lg ${
                                activeMenu === item.label 
                                    ? 'bg-white/20' 
                                    : 'bg-gray-100 group-hover:bg-violet-50'
                            }`}>
                                {getIcon()}
                            </div>
                            <span className="font-medium text-sm">
                                {item.label}
                            </span>
                            {activeMenu === item.label && (
                                <div className="ml-auto w-1.5 h-6 bg-white rounded-full"></div>
                            )}
                        </div>
                    );
                })}
            </nav>
            
            {/* App Version */}
            <div className="pt-4 mt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                    v1.0.0
                </p>
            </div>
            
        </div>
    )
}

export default SideMenu;
