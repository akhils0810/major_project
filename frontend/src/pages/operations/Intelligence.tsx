import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Brain, 
    AlertTriangle, 
    Activity, 
    ShieldAlert, 
    TrendingUp, 
    Clock, 
    CheckCircle2,
    Users,
    Map
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import { format, parseISO } from 'date-fns';

export default function Intelligence() {
    const navigate = useNavigate();
    
    const [timeframe, setTimeframe] = useState(24);
    const [timeSeriesData, setTimeSeriesData] = useState([]);
    const [hazardData, setHazardData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [verificationData, setVerificationData] = useState({ total: 0, distribution: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIntelligence = async () => {
            setLoading(true);
            try {
                const [timeRes, hazardRes, stateRes, verifRes] = await Promise.all([
                    fetch(`/api/v1/intelligence/time-series?hours=${timeframe}`),
                    fetch(`/api/v1/intelligence/hazards?hours=${timeframe}`),
                    fetch(`/api/v1/intelligence/states?hours=${timeframe}`),
                    fetch(`/api/v1/intelligence/verification?hours=${timeframe}`)
                ]);
                
                if (timeRes.ok) setTimeSeriesData(await timeRes.json());
                if (hazardRes.ok) setHazardData(await hazardRes.json());
                if (stateRes.ok) setStateData(await stateRes.json());
                if (verifRes.ok) setVerificationData(await verifRes.json());
            } catch (err) {
                console.error("Failed to fetch intelligence data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchIntelligence();
    }, [timeframe]);

    const COLORS = ['#0f766e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];
    
    const timeframes = [
        { label: '24H', hours: 24 },
        { label: '7D', hours: 168 },
        { label: '30D', hours: 720 },
        { label: '3M', hours: 2160 }
    ];

    return (
        <div className="space-y-6 flex flex-col h-full bg-background p-6 -m-6 pb-20 overflow-y-auto">
            <div className="flex items-start justify-between">
                <div className="max-w-2xl">
                    <span className="text-[10px] font-bold text-accent flex items-center gap-2 tracking-widest uppercase mb-4">
                        <Brain size={14} />
                        WEATHER INTELLIGENCE ENGINE
                    </span>
                    <h2 className="text-4xl font-bold tracking-tight text-foreground mb-3" style={{ letterSpacing: '-0.04em' }}>
                        Actionable intelligence beyond simple forecasts.
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium">
                        Monitor emerging signals, contradictions, misinformation propagation, and AI-assisted trust assessments across all verified events.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Time Filters */}
                    {timeframes.map((t) => (
                        <button 
                            key={t.label} 
                            onClick={() => setTimeframe(t.hours)}
                            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${timeframe === t.hours ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    {/* SECTION 1 - Time Series */}
                    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                        <div className="mb-6">
                            <h3 className="font-bold text-foreground">SECTION 1: Weather Reports Over Time</h3>
                            <p className="text-xs text-muted-foreground">High-throughput event timeline showing ingested vs. AI-verified reports across selected period ({timeframe === 24 ? '24H' : timeframe === 168 ? '7D' : timeframe === 720 ? '30D' : '3M'}).</p>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={timeSeriesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorIngested" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis 
                                        dataKey="timestamp" 
                                        tickFormatter={(v) => {
                                            try {
                                                const date = new Date(v);
                                                if (isNaN(date.getTime())) return '';
                                                if (timeframe === 24) return format(date, 'HH:mm');
                                                if (timeframe === 168) return format(date, 'EEE');
                                                if (timeframe === 720) {
                                                    const d = date.getDate();
                                                    if (d <= 7) return 'W1';
                                                    if (d <= 14) return 'W2';
                                                    if (d <= 21) return 'W3';
                                                    return 'W4';
                                                }
                                                if (timeframe === 2160) return format(date, 'MMM');
                                                return format(date, 'MMM d');
                                            } catch(e) {
                                                return '';
                                            }
                                        }}
                                        stroke="#888888" 
                                        fontSize={12} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        minTickGap={timeframe >= 720 ? 60 : 30}
                                    />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                        labelFormatter={(v) => {
                                            try {
                                                const date = new Date(v);
                                                if (isNaN(date.getTime())) return v;
                                                return format(date, 'MMM d, HH:mm');
                                            } catch(e) {
                                                return v;
                                            }
                                        }}
                                    />
                                    <Area type="monotone" dataKey="total_ingested" name="Total Ingested" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIngested)" />
                                    <Area type="monotone" dataKey="human_verified" name="Human Verified" stroke="#10b981" fillOpacity={1} fill="url(#colorVerified)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                        {/* SECTION 2 - Categories */}
                        <div className="lg:col-span-2 bg-card rounded-xl shadow-sm border border-border p-6">
                            <h3 className="font-bold text-foreground mb-6">Weather Events by Category</h3>
                            {hazardData.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No events recorded in the selected timeframe.</p>
                            ) : (
                                <div className="space-y-4">
                                    {hazardData.map((hazard: any, i: number) => (
                                        <div key={hazard.category} className="cursor-pointer group">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-semibold text-foreground capitalize group-hover:text-primary transition-colors">{hazard.category.replace('_', ' ')}</span>
                                                <span className="text-muted-foreground">{hazard.event_count} events ({hazard.percentage}%)</span>
                                            </div>
                                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${hazard.percentage}%`, backgroundColor: COLORS[i % COLORS.length] }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* SECTION 4 - Verification */}
                        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                            <h3 className="font-bold text-foreground mb-6">Verification Distribution</h3>
                            {verificationData.total === 0 ? (
                                <p className="text-sm text-muted-foreground">No verification data available.</p>
                            ) : (
                                <div>
                                    <div className="h-[200px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={verificationData.distribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="count"
                                                    nameKey="status"
                                                >
                                                    {verificationData.distribution.map((entry: any, index: number) => (
                                                        <Cell key={`cell-${index}`} fill={
                                                            entry.status === 'VERIFIED' ? '#10b981' : 
                                                            entry.status === 'REJECTED' ? '#ef4444' : 
                                                            entry.status === 'PENDING' ? '#f59e0b' : '#3b82f6'
                                                        } />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 pb-2">
                                        {verificationData.distribution.map((d: any) => (
                                            <div key={d.status} className="flex items-center gap-1.5 text-sm">
                                                <span className={`w-2.5 h-2.5 rounded-full ${
                                                    d.status === 'VERIFIED' ? 'bg-emerald-500' : 
                                                    d.status === 'REJECTED' ? 'bg-red-500' : 
                                                    d.status === 'PENDING' ? 'bg-amber-500' : 'bg-blue-500'
                                                }`}></span>
                                                <span className="font-bold text-foreground">{d.status}</span>
                                                <span className="text-muted-foreground">{d.percentage}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        {/* SECTION: Misinformation Propagation */}
                        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                <ShieldAlert className="text-rose-500" size={18} />
                                Misinformation Velocity
                            </h3>
                            <p className="text-sm text-muted-foreground mb-6">Real-time tracking of known deepfakes and recycled media attempting to propagate across the network.</p>
                            
                            <div className="space-y-4">
                                <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-foreground text-sm">2014 Kashmir Floods (Recycled)</p>
                                        <p className="text-xs text-muted-foreground mt-1">Image Hash: <span className="font-mono">8f9a2b...</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-rose-500 text-lg">1,402</p>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Blocks Today</p>
                                    </div>
                                </div>
                                <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-foreground text-sm">Generative Deepfake (Cyclone)</p>
                                        <p className="text-xs text-muted-foreground mt-1">AI Gen Probability: 99.8%</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-rose-500 text-lg">844</p>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Blocks Today</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION: What Changed */}
                        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                <TrendingUp className="text-blue-500" size={18} />
                                What Changed (vs Previous Period)
                            </h3>
                            <p className="text-sm text-muted-foreground mb-6">AI-generated summary of major shifts in the reporting landscape.</p>
                            
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 rounded bg-muted/30">
                                    <div className="mt-0.5 bg-rose-500/20 text-rose-500 p-1 rounded">
                                        <TrendingUp size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Sudden spike in heatwave reports</p>
                                        <p className="text-xs text-muted-foreground mt-1">Heatwave reports increased by 412% across Rajasthan and Gujarat in the last 6 hours.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded bg-muted/30">
                                    <div className="mt-0.5 bg-emerald-500/20 text-emerald-500 p-1 rounded transform rotate-180">
                                        <TrendingUp size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Flooding anomalies reduced</p>
                                        <p className="text-xs text-muted-foreground mt-1">Contradictory flood reports in urban centers dropped by 45% following ML tuning.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded bg-muted/30">
                                    <div className="mt-0.5 bg-amber-500/20 text-amber-500 p-1 rounded">
                                        <Clock size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Shift in reporting hours</p>
                                        <p className="text-xs text-muted-foreground mt-1">Peak citizen reporting time shifted from 18:00 to 14:00, correlating with peak heat index.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3 - States */}
                    <div className="bg-card rounded-xl shadow-sm border border-border p-6 mt-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-foreground">Weather Activity by State</h3>
                        </div>
                        {stateData.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No state-level data available.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                {stateData.map((state: any) => (
                                    <div key={state.state} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer bg-muted/20">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Map size={16} className="text-muted-foreground" />
                                            <h4 className="font-bold text-foreground">{state.state}</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-3">
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total Reports</p>
                                                <p className="font-semibold text-foreground text-sm mt-0.5">{state.total_reports}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Active Events</p>
                                                <p className="font-semibold text-accent text-sm mt-0.5">{state.active_events}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Primary Hazard</p>
                                                <p className="font-semibold text-foreground text-sm mt-0.5 capitalize">{state.primary_hazard.replace('_', ' ')}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Verified Rate</p>
                                                <p className={`font-semibold text-sm mt-0.5 ${state.verified_rate >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                    {state.verified_rate}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
            
            {/* SECTION 5 - Decision Matrix */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                        <Activity className="text-primary" size={18} />
                        Human + AI Verification Matrix
                    </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                    This matrix defines how the Varunetra ML engine triages incoming citizen reports and multi-source telemetry to establish ground truth.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Auto-Verify</span>
                            <span className="text-sm font-bold text-emerald-600">Conf &gt; 90%</span>
                        </div>
                        <p className="text-sm text-foreground mb-2"><strong>Trigger:</strong> Dense spatial clustering (5+ reports in 2km) AND high source reliability AND satellite confirmation.</p>
                        <p className="text-xs text-muted-foreground"><strong>Action:</strong> Automatically clusters into an active Weather Event. Bypasses human queue.</p>
                    </div>
                    <div className="border border-amber-500/20 bg-amber-500/5 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Human Review</span>
                            <span className="text-sm font-bold text-amber-600">40% - 90%</span>
                        </div>
                        <p className="text-sm text-foreground mb-2"><strong>Trigger:</strong> Conflicting evidence, isolated severe report, or low source reputation score.</p>
                        <p className="text-xs text-muted-foreground"><strong>Action:</strong> Routed to the "Reports to check" queue. Requires Duty Operator sign-off.</p>
                    </div>
                    <div className="border border-rose-500/20 bg-rose-500/5 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-widest text-rose-600">Auto-Reject (Noise)</span>
                            <span className="text-sm font-bold text-rose-600">Conf &lt; 40%</span>
                        </div>
                        <p className="text-sm text-foreground mb-2"><strong>Trigger:</strong> Perceptual hash matches past disaster imagery (deepfake/recycled) OR extreme sensor contradiction.</p>
                        <p className="text-xs text-muted-foreground"><strong>Action:</strong> Silently discarded. Added to the Misinformation Propagation blocklist.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
