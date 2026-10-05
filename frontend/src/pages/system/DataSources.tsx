import { Database, Activity, RefreshCcw, AlertCircle, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DataSources() {
    const [sources, setSources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSources = async () => {
            try {
                const res = await fetch('/api/v1/intelligence/sources');
                if (res.ok) {
                    setSources(await res.json());
                }
            } catch (err) {
                console.error("Failed to fetch sources", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSources();
    }, []);
    return (
        <div className="space-y-6 flex flex-col min-h-[calc(100vh-4rem)] p-6 -m-6 bg-background">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
                        Data Sources
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-2xl">
                        Monitor ingestion pipelines, API health, and source reliability scores.
                    </p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-border p-5 bg-card flex items-center justify-between">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                        <Database size={16} className="text-muted-foreground" />
                        Connected Sources
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Source Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Volume</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ingestion Rate</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Trust Score</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Last Sync</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Errors</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#cfcbc5]">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-muted-foreground">
                                        Loading sources...
                                    </td>
                                </tr>
                            ) : sources.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-muted-foreground">
                                        No data sources found.
                                    </td>
                                </tr>
                            ) : sources.map((source: any) => (
                                <tr key={source.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-foreground">{source.source_name}</span>
                                            <span className="text-xs text-muted-foreground uppercase">{source.source_type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${source.trust_score >= 80 ? 'bg-emerald-500' : source.trust_score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                            <span className="text-sm font-semibold text-muted-foreground">{source.trust_score >= 80 ? 'Active' : source.trust_score >= 50 ? 'Limited' : 'Quarantined'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-mono font-medium text-muted-foreground">{source.total_reports.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                                            <CheckCircle2 size={14} className="text-emerald-500" />
                                            {source.verified_reports.toLocaleString()} verified
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${source.trust_score >= 80 ? 'bg-emerald-500' : source.trust_score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                    style={{ width: `${Math.max(5, source.trust_score)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-mono font-bold text-foreground">{source.trust_score.toFixed(1)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                                            <RefreshCcw size={12} className="opacity-50" />
                                            Live sync
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {source.false_reports > 0 ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-sm uppercase tracking-widest border border-red-200">
                                                <AlertCircle size={10} /> {source.false_reports} FALSE
                                            </span>
                                        ) : (
                                            <span className="text-xs text-muted-foreground font-medium">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
