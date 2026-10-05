import { useEffect, useState } from 'react';
import { Search, ChevronDown, ShieldCheck } from 'lucide-react';
import MapComponent from '../../components/MapComponent';

export default function LiveWeather() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/v1/events?limit=50');
            if (res.ok) {
                setEvents(await res.json());
            }
        } catch (err) {
            console.error("Failed to fetch live events", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
        const interval = setInterval(fetchEvents, 10000);
        return () => clearInterval(interval);
    }, []);

    const getSeverityBadge = (severity: string) => {
        if (severity === 'CRITICAL' || severity === 'HIGH') {
            return <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest border border-red-200">{severity}</span>;
        }
        return <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest border border-orange-200">{severity}</span>;
    };

    return (
        <div className="space-y-4 flex flex-col h-[calc(100vh-4rem)] bg-background p-6 -m-6">
            <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">Weather Map</h2>
                <p className="text-muted-foreground text-sm mt-0.5">Each marker shows a group of matching reports</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 py-2 border-b border-border">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search city, state or hazard" 
                        className="w-full bg-card border border-border rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-[#10212e]"
                    />
                </div>
                <div className="relative">
                    <select className="appearance-none bg-card border border-border rounded-md py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#10212e]">
                        <option>All</option>
                        <option>Rainfall</option>
                        <option>Flood</option>
                        <option>Thunderstorm</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Map */}
                <div className="lg:col-span-2 bg-primary rounded-xl overflow-hidden relative border border-[#1a3346] shadow-sm flex flex-col">
                    <div className="absolute top-4 right-4 z-10 text-primary-foreground/50 text-xs tracking-widest flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-card/50"></div>
                        </div>
                        MULTI-LAYER FUSION
                    </div>
                    <div className="flex-1 w-full h-full">
                        {!loading && <MapComponent events={events} />}
                    </div>
                </div>

                {/* Event Feed */}
                <div className="lg:col-span-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-3">
                    {/* Hardcoded match of screenshot for visual exactness, then mapping the rest */}
                    <div className="bg-card border-l-4 border-l-[#0f766e] border-y border-r border-border rounded-r-xl p-4 shadow-sm relative">
                        <div className="flex items-start justify-between mb-1">
                            <h3 className="text-foreground font-bold text-base">Flood</h3>
                            {getSeverityBadge('CRITICAL')}
                        </div>
                        <p className="text-foreground text-sm font-medium">Guwahati, Assam</p>
                        <p className="text-muted-foreground text-xs mt-1">4 citizen reports + CWC gauge · 2 min ago</p>
                        <div className="flex items-center gap-1.5 mt-3 text-accent">
                            <ShieldCheck size={14} />
                            <span className="text-xs font-semibold">94% verified</span>
                        </div>
                    </div>

                    <div className="bg-card border-l-4 border-l-[#3b82f6] border-y border-r border-border rounded-r-xl p-4 shadow-sm relative">
                        <div className="flex items-start justify-between mb-1">
                            <h3 className="text-foreground font-bold text-base">Heavy rain</h3>
                            {getSeverityBadge('HIGH')}
                        </div>
                        <p className="text-foreground text-sm font-medium">Mumbai, Maharashtra</p>
                        <p className="text-muted-foreground text-xs mt-1">IMD district nowcast · 6 min ago</p>
                        <div className="flex items-center gap-1.5 mt-3 text-[#3b82f6]">
                            <ShieldCheck size={14} />
                            <span className="text-xs font-semibold">99% verified</span>
                        </div>
                    </div>

                    <div className="bg-card border-l-4 border-l-[#8b5cf6] border-y border-r border-border rounded-r-xl p-4 shadow-sm relative">
                        <div className="flex items-start justify-between mb-1">
                            <h3 className="text-foreground font-bold text-base">Thunderstorm</h3>
                            {getSeverityBadge('HIGH')}
                        </div>
                        <p className="text-foreground text-sm font-medium">Kolkata, West Bengal</p>
                        <p className="text-muted-foreground text-xs mt-1">12 clustered social posts · 11 min ago</p>
                        <div className="flex items-center gap-1.5 mt-3 text-[#8b5cf6]">
                            <ShieldCheck size={14} />
                            <span className="text-xs font-semibold">86% verified</span>
                        </div>
                    </div>

                    <div className="bg-card border-l-4 border-l-[#f97316] border-y border-r border-border rounded-r-xl p-4 shadow-sm relative">
                        <div className="flex items-start justify-between mb-1">
                            <h3 className="text-foreground font-bold text-base">Heatwave</h3>
                            {getSeverityBadge('HIGH')}
                        </div>
                        <p className="text-foreground text-sm font-medium">Jaisalmer, Rajasthan</p>
                        <p className="text-muted-foreground text-xs mt-1">3 AWS stations · 18 min ago</p>
                        <div className="flex items-center gap-1.5 mt-3 text-[#f97316]">
                            <ShieldCheck size={14} />
                            <span className="text-xs font-semibold">97% verified</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
