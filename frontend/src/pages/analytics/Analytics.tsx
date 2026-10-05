import { useState, useEffect } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function Analytics() {
    const [velocityData, setVelocityData] = useState([]);
    const [hazardMix, setHazardMix] = useState([]);
    const [regionalIntensity, setRegionalIntensity] = useState([]);
    const [verificationMetrics, setVerificationMetrics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [velRes, hazRes, regRes, verRes] = await Promise.all([
                    fetch('/api/v1/analytics/velocity'),
                    fetch('/api/v1/analytics/hazards'),
                    fetch('/api/v1/analytics/regional'),
                    fetch('/api/v1/analytics/verification')
                ]);
                
                if (velRes.ok) setVelocityData(await velRes.json());
                if (hazRes.ok) setHazardMix(await hazRes.json());
                if (regRes.ok) setRegionalIntensity(await regRes.json());
                if (verRes.ok) setVerificationMetrics(await verRes.json());
            } catch (err) {
                console.error("Error fetching analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }
    return (
        <div className="space-y-8 pb-10 flex flex-col min-h-[calc(100vh-4rem)] p-6 -m-6 bg-background">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">Weather analytics</h2>
                <p className="text-muted-foreground text-sm max-w-2xl">
                    Understand report velocity, regional concentration, verification coverage and dominant hazards across India.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Section 1: National Report Velocity */}
                <div className="xl:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="border-b border-border p-5 bg-card">
                        <h3 className="text-base font-bold text-foreground">National report velocity</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">Incoming reports and verified weather events over time</p>
                    </div>
                    <div className="p-6 flex-1 min-h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0f766e" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cfcbc5" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#fff', borderColor: '#cfcbc5', borderRadius: '8px' }}
                                    itemStyle={{ fontSize: '13px' }}
                                    labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
                                />
                                <Area type="monotone" dataKey="reports" name="Incoming reports" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorReports)" />
                                <Area type="monotone" dataKey="events" name="Verified events" stroke="#0f766e" strokeWidth={2} fillOpacity={1} fill="url(#colorEvents)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="xl:col-span-1 space-y-6">
                    {/* Section 2: Hazard Mix */}
                    <div className="bg-card border border-border rounded-xl shadow-sm">
                        <div className="border-b border-border p-5 bg-card">
                            <h3 className="text-base font-bold text-foreground">Hazard mix</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">Share of active weather events</p>
                        </div>
                        <div className="p-5 space-y-4">
                            {hazardMix.map(hazard => (
                                <div key={hazard.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${hazard.color.replace('bg-', 'bg-').replace('text-', 'text-')}`}></div>
                                        <span className="text-foreground font-medium">{hazard.name}</span>
                                    </div>
                                    <span className="font-semibold text-muted-foreground">{hazard.share}%</span>
                                </div>
                            ))}
                            {/* Distribution Bar */}
                            <div className="flex h-2 w-full rounded-full overflow-hidden mt-6 bg-muted">
                                {hazardMix.map(hazard => (
                                    <div key={hazard.name} className={`h-full ${hazard.color}`} style={{ width: `${hazard.share}%` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Verification Quality */}
                    <div className="bg-card border border-border rounded-xl shadow-sm">
                        <div className="border-b border-border p-5 bg-card">
                            <h3 className="text-base font-bold text-foreground">Verification quality</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">AI pipeline performance</p>
                        </div>
                        <div className="p-5 grid grid-cols-2 gap-y-6 gap-x-4">
                            {verificationMetrics.map(metric => (
                                <div key={metric.label}>
                                    <h4 className="text-2xl font-bold text-foreground">{metric.value}</h4>
                                    <p className="text-xs font-semibold text-muted-foreground mt-1">{metric.label}</p>
                                    <p className="text-[10px] text-muted-foreground">{metric.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section 4: Regional Intensity */}
                <div className="xl:col-span-3 bg-card border border-border rounded-xl shadow-sm overflow-hidden mb-8">
                    <div className="border-b border-border p-5 bg-card">
                        <h3 className="text-base font-bold text-foreground">Regional intensity</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">Weather reports and verified events in the last 6 hours</p>
                    </div>
                    <div className="divide-y divide-[#cfcbc5]">
                        {regionalIntensity.map((region, idx) => {
                            const isPositive = region.trend.startsWith('+');
                            return (
                                <div key={region.state} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">0{idx + 1}</span>
                                        <span className="font-semibold text-foreground group-hover:text-teal-700 transition-colors">{region.state}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-sm text-muted-foreground font-medium">{region.events} verified events</span>
                                        <span className={`text-xs font-bold w-12 text-right ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {region.trend}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
