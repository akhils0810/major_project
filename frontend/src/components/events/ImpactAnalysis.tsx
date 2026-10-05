import { useState, useEffect } from 'react';
import { ShieldAlert, Users, TrendingDown, Map, AlertTriangle, CheckCircle2, Factory } from 'lucide-react';

interface ImpactAnalysisProps {
    eventId: string;
}

export default function ImpactAnalysis({ eventId }: ImpactAnalysisProps) {
    const [impact, setImpact] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchImpact = async () => {
            try {
                const res = await fetch(`/api/v1/events/${eventId}/impact`);
                if (res.ok) {
                    setImpact(await res.json());
                }
            } catch (err) {
                console.error("Failed to fetch impact data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchImpact();
    }, [eventId]);
    
    if (loading) {
        return (
            <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }
    
    if (!impact) {
        return null;
    }
    
    return (
        <div className="bg-background rounded-lg border border-border p-6 shadow-inner">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <ShieldAlert className="text-rose-500" size={20} />
                        Impact Intelligence & Route Risk
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        AI-estimated regional impact and logistical routing assessments.
                    </p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                        <Users size={16} />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Est. Population Affected</h4>
                    </div>
                    <p className="text-3xl font-bold text-foreground">
                        {impact.affected_population_est.toLocaleString()}
                    </p>
                </div>
                
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                        <TrendingDown size={16} />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Est. Economic Risk</h4>
                    </div>
                    <p className="text-3xl font-bold text-foreground">
                        ₹{impact.economic_impact_est_cr} <span className="text-sm font-medium text-muted-foreground">Cr</span>
                    </p>
                </div>
                
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                        <Factory size={16} />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Infrastructure Flags</h4>
                    </div>
                    <p className="text-3xl font-bold text-rose-500">
                        {impact.critical_infrastructure_at_risk}
                    </p>
                </div>
            </div>
            
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                <Map size={16} className="text-primary" />
                Route Risk Assessments
            </h4>
            
            <div className="space-y-3">
                {impact.route_assessments.map((route: any, idx: number) => (
                    <div key={idx} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                                route.status === 'BLOCKED' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' :
                                route.status === 'AT RISK' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                                'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                            }`}>
                                {route.status === 'BLOCKED' ? <ShieldAlert size={18} /> :
                                 route.status === 'AT RISK' ? <AlertTriangle size={18} /> :
                                 <CheckCircle2 size={18} />}
                            </div>
                            <div>
                                <h5 className="font-bold text-foreground text-sm">{route.id}</h5>
                                <p className="text-xs text-muted-foreground mt-0.5">{route.reason}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-sm border uppercase tracking-widest ${
                                route.risk_level === 'CRITICAL' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' :
                                route.risk_level === 'HIGH' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                                'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                            }`}>
                                {route.risk_level} RISK
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
