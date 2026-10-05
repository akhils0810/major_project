import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, Moon, Sun, Languages, LogOut, ChevronDown } from 'lucide-react';

export default function Header() {
    const location = useLocation();
    
    // Map path to section name
    const getSectionName = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return 'OVERVIEW';
        if (path.includes('live-weather')) return 'LIVE WEATHER UPDATES';
        if (path.includes('reports')) return 'REPORTS TO CHECK';
        if (path.includes('trends')) return 'TRENDS';
        if (path.includes('alerts')) return 'ALERTS';
        if (path.includes('data-sources')) return 'DATA SOURCES';
        if (path.includes('system-status')) return 'SYSTEM STATUS';
        return 'OVERVIEW';
    };
    const [darkMode, setDarkMode] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button className="md:hidden text-muted-foreground hover:text-foreground">
                    <Menu size={20} />
                </button>
                <div className="hidden md:flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="font-semibold text-muted-foreground text-xs tracking-widest uppercase">
                            WEATHER UPDATES ACROSS INDIA
                        </span>
                    </div>
                    <span className="text-gray-300 text-sm border-l border-border pl-3">
                        <span className="text-muted-foreground text-xs tracking-widest font-semibold">{getSectionName()}</span>
                    </span>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 border-r border-border pr-6 relative">
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                        <Languages size={16} />
                        EN <span className="text-[10px]">▼</span>
                    </button>
                    <button 
                        onClick={toggleDarkMode}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md border border-border bg-card shadow-sm"
                    >
                        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`transition-colors p-1.5 rounded-md border border-border shadow-sm relative ${showNotifications ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground bg-card'}`}
                        >
                            <Bell size={16} />
                            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        </button>
                        
                        {showNotifications && (
                            <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded-md shadow-lg overflow-hidden z-50">
                                <div className="p-3 border-b border-gray-100 bg-muted/50 flex items-center justify-between">
                                    <span className="text-xs font-bold text-foreground uppercase tracking-widest">Notifications</span>
                                    <button className="text-[10px] font-semibold text-accent">Mark all read</button>
                                </div>
                                <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                                    <div className="p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                            <span className="text-xs font-bold text-foreground">NEW REPORT MATCH</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">High confidence thunderstorm report near Hyderabad sector.</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">2 mins ago</p>
                                    </div>
                                    <div className="p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                            <span className="text-xs font-bold text-foreground">API SYNC DELAY</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">IMD Data source sync is delayed by 45 seconds.</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">15 mins ago</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="relative">
                    <button 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-3 hover:bg-muted/50 p-1.5 rounded-md transition-colors"
                    >
                        <div className="w-8 h-8 rounded-md bg-[hsl(var(--sidebar))] text-primary-foreground font-bold text-xs flex items-center justify-center">
                            ND
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-foreground">National Desk</span>
                            <span className="text-[10px] font-medium text-muted-foreground">Duty operator</span>
                        </div>
                        <ChevronDown size={14} className="text-muted-foreground ml-1" />
                    </button>

                    {showProfileMenu && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg overflow-hidden z-50">
                            <div className="p-3 border-b border-border bg-muted/20">
                                <span className="text-xs font-bold text-foreground block">System Admin</span>
                                <span className="text-[10px] text-muted-foreground">ID: VD-9942</span>
                            </div>
                            <div className="p-1">
                                <button 
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        navigate('/');
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive rounded-sm transition-colors flex items-center gap-2"
                                >
                                    <LogOut size={14} />
                                    Logout to Portal
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
