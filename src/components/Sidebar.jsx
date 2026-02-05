import React from 'react';
import { ListTodo, Star, Calendar, X, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ currentView, setCurrentView, isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const { currentUser, logout } = useAuth();

    const menuItems = [
        { id: 'all', label: 'My Tasks', icon: ListTodo },
        { id: 'starred', label: 'Starred Tasks', icon: Star },
        { id: 'activity', label: 'Activity', icon: Calendar },
    ];

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    return (
        <>
            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed md:static inset-y-0 left-0 z-50
          w-72 glass-strong shadow-glass-lg border-r border-glass-border
          transform transition-all duration-300 ease-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-glass-border">
                    <h2 className="text-2xl font-display font-bold text-white glow-text">Tasks</h2>
                    {/* Close button for mobile */}
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User Profile Section */}
                {currentUser && (
                    <div className="p-6 border-b border-glass-border">
                        <div className="flex items-center gap-3 mb-4">
                            {/* User Avatar with glow */}
                            <div className="relative">
                                <img
                                    src={currentUser.photoURL || 'https://via.placeholder.com/40'}
                                    alt={currentUser.displayName || 'User'}
                                    className="w-12 h-12 rounded-full border-2 border-accent-purple shadow-glow"
                                />
                                <div className="absolute inset-0 rounded-full bg-gradient-accent opacity-20 blur-md" />
                            </div>
                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold text-sm truncate">
                                    {currentUser.displayName || 'User'}
                                </p>
                                <p className="text-gray-400 text-xs truncate">
                                    {currentUser.email}
                                </p>
                            </div>
                        </div>
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="
                                w-full flex items-center justify-center gap-2
                                px-4 py-2.5 rounded-xl
                                glass hover:glass-strong
                                text-gray-300 hover:text-white
                                text-sm font-medium
                                transition-all duration-300
                                border border-glass-border hover:border-white/20
                                transform hover:scale-[1.02]
                            "
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                )}

                {/* Navigation Menu */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;

                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => {
                                            setCurrentView(item.id);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`
                      w-full flex items-center gap-3 px-4 py-3.5 rounded-xl
                      transition-all duration-300
                      ${isActive
                                                ? 'glass-strong shadow-glow text-white border border-accent-purple/30'
                                                : 'text-gray-300 hover:glass hover:text-white border border-transparent hover:border-glass-border'
                                            }
                      transform hover:scale-[1.02]
                    `}
                                    >
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-accent-purple' : ''}`} />
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-glass-border">
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                        <span className="w-2 h-2 bg-accent-purple rounded-full animate-glow-pulse" />
                        <span>Synced with Firebase</span>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
