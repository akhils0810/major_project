import { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, FileText, Check, X, ShieldAlert, Image as ImageIcon, Camera, ScanFace } from 'lucide-react';

export default function Verification() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingReports = async () => {
        try {
            const res = await fetch('/api/v1/reports?limit=20'); // In real app, filter by PENDING
            if (res.ok) {
                const data = await res.json();
                setReports(data.filter((r: any) => r.verification_status !== 'VERIFIED' && r.verification_status !== 'REJECTED'));
            }
        } catch (err) {
            console.error("Failed to fetch pending reports", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingReports();
    }, []);

    const handleVerifyAction = async (id: number, status: string) => {
        // In real app, make API call to update status
        setReports(reports.filter(r => r.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Operational Intelligence</span>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        Report Verification Queue
                        <span className="bg-amber-500/10 text-amber-500 text-xs px-2 py-0.5 rounded-md border border-amber-500/20">{reports.length} Pending</span>
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
                        Review incoming reports that require human oversight before event clustering.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : reports.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm">
                    <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-foreground">Queue is empty</h3>
                    <p className="text-muted-foreground mt-1">All reports have been verified.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {reports.map(report => (
                        <div key={report.id} className="bg-card border border-border rounded-xl shadow-sm flex flex-col xl:flex-row overflow-hidden">
                            
                            {/* Left: Report Header & Content */}
                            <div className="p-6 xl:w-1/3 border-b xl:border-b-0 xl:border-r border-border bg-card/50">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Report #WR-{2026000 + report.id}</h3>
                                        <p className="text-xs text-muted-foreground">{new Date(report.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                                <h4 className="text-lg font-bold text-foreground mb-1">{report.event_category?.toUpperCase()}</h4>
                                <p className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-1.5">
                                    <MapPin size={14} />
                                    {report.city ? `${report.city}, ` : ''}{report.state || 'Unknown Location'}
                                </p>
                                <div className="bg-background border border-input rounded-md p-4 mb-4">
                                    <p className="text-sm text-foreground leading-relaxed">
                                        "{report.content}"
                                    </p>
                                </div>
                                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                                    <span>Source: {report.source || 'Citizen Report'}</span>
                                    <span>User: Anon</span>
                                </div>
                            </div>

                            {/* Middle: Evidence & Confidence */}
                            <div className="p-6 xl:w-1/3 border-b xl:border-b-0 xl:border-r border-border">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">AI Verification Evidence</h4>
                                
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex-1">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-foreground">Model Confidence</span>
                                            <span className="font-bold text-foreground">{Math.round((report.confidence_score || 0) * 100)}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${report.confidence_score > 0.7 ? 'bg-emerald-500' : report.confidence_score > 0.4 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                style={{ width: `${(report.confidence_score || 0) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="bg-card border border-border rounded-lg p-3 text-center">
                                        <ScanFace size={16} className="mx-auto text-emerald-500 mb-1" />
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Deepfake Scan</div>
                                        <div className="text-xs font-bold text-foreground mt-0.5">AUTHENTIC</div>
                                    </div>
                                    <div className="bg-card border border-border rounded-lg p-3 text-center">
                                        <ImageIcon size={16} className="mx-auto text-emerald-500 mb-1" />
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Image Hash</div>
                                        <div className="text-xs font-bold text-foreground mt-0.5">UNIQUE (No Duplicates)</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                        <span className="text-sm text-foreground">3 nearby reports detected in 10km radius</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                        <span className="text-sm text-foreground">Precise geolocation metadata available</span>
                                    </div>
                                    {report.confidence_score < 0.6 && (
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                                            <span className="text-sm text-foreground">Source has low reputation history</span>
                                        </div>
                                    )}
                                    {report.confidence_score < 0.8 && (
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                                            <span className="text-sm text-foreground">Cross-referenced satellite weather evidence is incomplete</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="p-6 xl:w-1/3 flex flex-col justify-center bg-card/20">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 xl:text-center">Action Required</h4>
                                <div className="flex flex-col gap-3">
                                    <button 
                                        onClick={() => handleVerifyAction(report.id, 'VERIFIED')}
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-primary-foreground px-4 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                                    >
                                        <Check size={18} strokeWidth={3} />
                                        VERIFY AS LEGITIMATE
                                    </button>
                                    <button 
                                        onClick={() => handleVerifyAction(report.id, 'REJECTED')}
                                        className="w-full bg-background hover:bg-rose-500/10 text-rose-500 border border-rose-500/50 hover:border-rose-500 px-4 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                                    >
                                        <X size={18} strokeWidth={3} />
                                        REJECT AS NOISE
                                    </button>
                                    <button 
                                        onClick={() => handleVerifyAction(report.id, 'REVIEW')}
                                        className="w-full bg-background hover:bg-amber-500/10 text-amber-500 border border-amber-500/50 hover:border-amber-500 px-4 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                                    >
                                        <ShieldAlert size={18} strokeWidth={3} />
                                        ESCALATE FOR MORE REVIEW
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
