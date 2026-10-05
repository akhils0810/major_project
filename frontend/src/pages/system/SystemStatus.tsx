import { useState, useEffect } from 'react';
import { Activity, Server, Database, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SystemStatus() {
    const [statusData, setStatusData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch('/api/v1/system/status');
                if (res.ok) {
                    setStatusData(await res.json());
                }
            } catch (err) {
                console.error("Failed to fetch system status", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'Database': return Database;
            case 'Streaming': return Activity;
            case 'Inference': return Cpu;
            case 'Processing': return Cpu;
            default: return Server;
        }
    };

    if (loading && !statusData) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 flex flex-col min-h-[calc(100vh-4rem)] p-6 -m-6 bg-background">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3 mb-1">
                        System Status
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm border border-emerald-200 uppercase tracking-widest">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            All Systems Nominal
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-2xl">
                        Monitor microservice health, processing latency, and infrastructure uptime.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statusData?.services.map((service: any) => {
                    const Icon = getIcon(service.type);
                    return (
                        <div key={service.name} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground text-sm">{service.name}</h3>
                                        <p className="text-xs font-semibold text-muted-foreground">{service.type}</p>
                                    </div>
                                </div>
                                {service.status === 'Operational' ? (
                                    <CheckCircle2 size={16} className="text-accent" />
                                ) : (
                                    <AlertTriangle size={16} className="text-amber-600" />
                                )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Uptime</p>
                                    <p className="text-sm font-mono font-bold text-foreground">{service.uptime}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Latency</p>
                                    <p className="text-sm font-mono font-bold text-foreground">{service.latency}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="border-b border-border p-5 bg-card">
                    <h3 className="text-base font-bold text-foreground">Active Processing Queues</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Raw Ingestion</span>
                            <span className="text-sm font-mono font-bold text-foreground">{statusData?.queues.ingestion || 0} msgs</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-accent w-[5%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Verification Engine</span>
                            <span className="text-sm font-mono font-bold text-foreground">{statusData?.queues.verification || 0} msgs</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 w-[45%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dead Letter Queue</span>
                            <span className="text-sm font-mono font-bold text-foreground">{statusData?.queues.dlq || 0} msgs</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gray-300 w-0"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
