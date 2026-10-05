import { Link, useLocation } from 'react-router-dom';
import { removeToken } from '../../services/auth';
import { 
    LayoutDashboard, 
    Radio, 
    FileText, 
    Layers, 
    ShieldCheck, 
    BellRing, 
    BarChart3, 
    Map, 
    Flame, 
    Database, 
    Activity, 
    LogOut, 
    CloudLightning,
    TrendingUp,
    Brain
} from 'lucide-react';

const navGroups = [
    {
        title: 'Operations',
        items: [
            { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
            { name: 'Live weather updates', path: '/admin/live-weather', icon: Radio },
            { name: 'Intelligence', path: '/admin/intelligence', icon: Brain },
            { name: 'Reports to check', path: '/admin/reports', icon: ShieldCheck },
            { name: 'Clustered Events', path: '/admin/events', icon: Layers },
            { name: 'Trends', path: '/admin/analytics', icon: TrendingUp },
            { name: 'Alerts', path: '/admin/alerts', icon: BellRing },
        ]
    },
    {
        title: 'System',
        items: [
            { name: 'Data sources', path: '/admin/data-sources', icon: Database },
            { name: 'System status', path: '/admin/system-status', icon: Activity },
        ]
    }
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <div className="w-64 bg-[hsl(var(--sidebar))] border-r border-[hsl(var(--sidebar-muted))] hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0 overflow-hidden text-[hsl(var(--sidebar-foreground))]">
            <div className="h-20 border-b border-[hsl(var(--sidebar-muted))] flex items-center px-4 gap-3 bg-[hsl(var(--sidebar))]">
                <div className="w-8 h-8 bg-transparent border border-gray-600 rounded-full flex items-center justify-center shadow-sm">
                    <CloudLightning size={16} strokeWidth={2.5} className="text-teal-400" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-sm tracking-widest text-primary-foreground leading-tight">
                        VARUNETRA
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">
                        National Weather Updates
                    </span>
                </div>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto custom-scrollbar">
                <nav className="space-y-6">
                    {navGroups.map((group, idx) => (
                        <div key={idx}>
                            <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                {group.title}
                            </h4>
                            <div className="space-y-0.5">
                                {group.items.map((item) => {
                                    const active = location.pathname === item.path;
                                    const Icon = item.icon;
                                    return (
                                        <Link 
                                            key={item.name} 
                                            to={item.path} 
                                            className={`flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors ${
                                                active 
                                                ? 'bg-[hsl(var(--sidebar-muted))] text-primary-foreground font-medium shadow-sm border-l-2 border-teal-500' 
                                                : 'text-muted-foreground hover:bg-[hsl(var(--sidebar-muted))] hover:text-primary-foreground'
                                            }`}
                                        >
                                            <Icon size={16} strokeWidth={active ? 2.5 : 2} className={active ? 'text-teal-400' : ''} />
                                            {item.name}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
            
            <div className="p-4 border-t border-[hsl(var(--sidebar-muted))] bg-[hsl(var(--sidebar))]">
                <div className="flex items-center gap-3 p-2 rounded-md bg-[hsl(var(--sidebar-muted))] border border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer">
                    <Activity size={24} className="text-emerald-500" />
                    <div>
                        <p className="text-xs font-semibold text-primary-foreground">Systems working normally</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">8.4k reports checked each minute</p>
                    </div>
                </div>
                <div className="mt-4 flex justify-between px-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    <span>National Weather Desk</span>
                    <span>V1.0</span>
                </div>
            </div>
        </div>
    );
}
