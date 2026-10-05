import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, ShieldCheck, FileText, Activity } from 'lucide-react';
import MapComponent from '../../components/MapComponent';
import EventFeed from '../../components/EventFeed';
import ReportFeed from '../../components/ReportFeed';

export default function Overview() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const [dashboardData, setDashboardData] = useState<any>(null);

    const fetchData = async () => {
        try {
            const [eventsRes, reportsRes, dashboardRes] = await Promise.all([
                fetch('/api/v1/events?limit=100'),
                fetch('/api/v1/reports?limit=100'),
                fetch('/api/v1/dashboard/overview')
            ]);
            if (eventsRes.ok) setEvents(await eventsRes.json());
            if (reportsRes.ok) setReports(await reportsRes.json());
            if (dashboardRes.ok) setDashboardData(await dashboardRes.json());
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div className="max-w-2xl">
                    <span className="text-[10px] font-bold text-destructive flex items-center gap-2 tracking-widest uppercase mb-4">
                        <Activity size={14} />
                        NATIONAL WEATHER DESK
                    </span>
                    <h2 className="text-5xl font-bold tracking-tight text-foreground mb-3" style={{ letterSpacing: '-0.04em' }}>
                        Clear weather updates
                        <br />for faster action.
                    </h2>
                    <p className="text-muted-foreground text-base font-medium">
                        See checked weather reports, risks, source status, and alerts across India in one place.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/admin/reports')}
                        className="bg-card border border-border hover:bg-muted text-foreground px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors"
                    >
                        <ShieldCheck size={16} />
                        Check reports
                    </button>
                    <button 
                        onClick={() => navigate('/admin/live-weather')}
                        className="bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors"
                    >
                        <Map size={16} />
                        Open weather map
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 mt-8 mb-4 border-t border-b border-border py-6">
                <div className="px-6 border-r border-border last:border-0 relative">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Events</p>
                        <div className="w-6 h-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                            <Activity size={12} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-4xl font-bold text-foreground">{dashboardData?.active_events || events.length}</h3>
                        <span className="text-xs text-muted-foreground font-medium tracking-wide">8 critical across 18 states</span>
                    </div>
                </div>
                
                <div className="px-6 border-r border-border last:border-0">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reports Today</p>
                        <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <FileText size={12} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-4xl font-bold text-foreground">{dashboardData?.reports_today || reports.length}</h3>
                        <span className="text-xs text-muted-foreground font-medium tracking-wide">+12.4% from yesterday</span>
                    </div>
                </div>

                <div className="px-6 border-r border-border last:border-0">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reports Checked</p>
                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                            <ShieldCheck size={12} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-4xl font-bold text-foreground">94.2%</h3>
                        <span className="text-xs text-muted-foreground font-medium tracking-wide">{dashboardData?.reports_verified || 17360} reports reviewed</span>
                    </div>
                </div>
                
                <div className="px-6 border-r border-border last:border-0">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Repeat Reports Grouped</p>
                        <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                            <FileText size={12} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-4xl font-bold text-foreground">{dashboardData?.duplicates_grouped || 3841}</h3>
                        <span className="text-xs text-muted-foreground font-medium tracking-wide">20.8% repeats removed</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Map Section */}
                <div className="xl:col-span-2 bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                    <div className="p-5 border-b border-border flex items-start justify-between bg-card">
                        <div>
                            <h3 className="text-lg font-bold text-foreground tracking-tight">Weather situation now</h3>
                            <p className="text-sm text-muted-foreground mt-1">Reports checked using official, sensor, and public information</p>
                        </div>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 uppercase tracking-widest">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            6 ON MAP
                        </span>
                    </div>
                    <div className="flex-1 min-h-[500px] bg-primary relative">
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <MapComponent events={events} />
                        )}
                    </div>
                </div>

                {/* Right Side Cards */}
                <div className="xl:col-span-1 flex flex-col gap-6">
                    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="text-foreground font-bold text-base">Flood · Guwahati</h3>
                                <p className="text-muted-foreground text-xs mt-0.5">Assam · 2 min ago</p>
                            </div>
                            <span className="bg-destructive/10 text-destructive text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest border border-destructive/20">
                                CRITICAL
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4 mb-6 leading-relaxed">
                            Rapid waterlogging reported near Bharalu basin. Four independent visuals match rainfall and gauge telemetry.
                        </p>
                        
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Trust score</span>
                                <span className="text-sm font-bold text-foreground">94%</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-accent w-[94%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
