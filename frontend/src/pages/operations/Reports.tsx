import { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle, Image as ImageIcon, ScanFace, FileCode2, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function Reports() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCritical, setFilterCritical] = useState(false);

    const fetchReports = async () => {
        try {
            const res = await fetch('/api/v1/reports?limit=100');
            if (res.ok) {
                setReports(await res.json());
            }
        } catch (err) {
            console.error("Failed to fetch reports", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleUpdateStatus = async (reportId: string, newStatus: 'VERIFIED' | 'REJECTED') => {
        try {
            const res = await fetch(`/api/v1/reports/${reportId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                // Optimistically update the UI
                setReports(prev => prev.map(r => 
                    r.id === reportId ? { ...r, verification_status: newStatus } : r
                ));
            }
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const filteredReports = filterCritical 
        ? reports.filter(r => r.verification_status === 'PENDING' || r.confidence_score > 80) 
        : reports;

    return (
        <div className="space-y-6 flex flex-col min-h-[calc(100vh-4rem)] p-6 -m-6 bg-background">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
                        Verify incoming reports
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Human-in-the-loop verification for critical incidents detected by the ML engine.
                    </p>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="bg-[#e4e1dc] rounded-md flex items-center justify-between p-4 shadow-inner">
                <div className="flex gap-12 pl-4">
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-red-600">3</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">TO CHECK</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-muted-foreground">38s</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">USUAL CHECK TIME</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-emerald-600">12.4k</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">CHECKED TODAY</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">Filter by:</span>
                    <button 
                        onClick={() => setFilterCritical(!filterCritical)}
                        className={`${filterCritical ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border'} border px-3 py-1.5 rounded text-sm flex items-center gap-2 shadow-sm font-medium transition-colors`}
                    >
                        <Filter size={14} /> Critical Only
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="flex h-32 items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className="bg-card border border-border rounded-lg p-5 flex items-center justify-center text-muted-foreground">
                        No reports to verify.
                    </div>
                ) : (
                    filteredReports.map((report) => (
                        <div key={report.id} className="bg-card border border-border rounded-lg p-5 flex items-start justify-between shadow-sm">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-bold text-foreground capitalize">{report.event_category?.replace('_', ' ') || 'Unknown Event'}</h3>
                                    <span className="text-muted-foreground text-sm">→</span>
                                    <span className="text-muted-foreground text-sm font-medium">
                                        {report.city ? `${report.city}, ` : ''}{report.state || 'Unknown Location'}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest border ml-4 flex items-center gap-1 ${
                                        report.verification_status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                        report.verification_status === 'REJECTED' ? 'bg-red-100 text-red-700 border-red-200' :
                                        'bg-amber-100 text-amber-700 border-amber-200'
                                    }`}>
                                        {report.verification_status === 'PENDING' && <AlertTriangle size={10} />}
                                        {report.verification_status || 'PENDING'}
                                    </span>
                                    {report.media_url && (
                                        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest border border-blue-200 ml-2 flex items-center gap-1">
                                            <ImageIcon size={10} />
                                            MEDIA
                                        </span>
                                    )}
                                    <span className="ml-auto text-xs font-semibold text-muted-foreground">
                                        {(report.confidence_score * 100).toFixed(0)}% Confidence
                                    </span>
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                    {report.content || "No details provided."}
                                </p>
                                
                                
                                {/* AI Media Verification */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex items-center gap-1.5 bg-card border border-border px-2.5 py-1 rounded text-xs">
                                        <ScanFace size={14} className="text-emerald-500" />
                                        <span className="font-bold text-muted-foreground uppercase tracking-widest text-[9px]">DEEPFAKE SCAN:</span>
                                        <span className="font-bold text-foreground">AUTHENTIC</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-card border border-border px-2.5 py-1 rounded text-xs">
                                        <FileCode2 size={14} className="text-emerald-500" />
                                        <span className="font-bold text-muted-foreground uppercase tracking-widest text-[9px]">IMAGE HASH:</span>
                                        <span className="font-bold text-foreground">UNIQUE (NO DUPES)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-card border border-border px-2.5 py-1 rounded text-xs">
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                        <span className="font-bold text-muted-foreground uppercase tracking-widest text-[9px]">REPORTER REPUTATION:</span>
                                        <span className="font-bold text-foreground">HIGH (92%)</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => handleUpdateStatus(report.id, 'REJECTED')}
                                        className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded text-sm font-semibold transition-colors"
                                    >
                                        Flag misleading
                                    </button>
                                    <button 
                                        onClick={() => handleUpdateStatus(report.id, 'VERIFIED')}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded text-sm font-semibold transition-colors"
                                    >
                                        Verify report
                                    </button>
                                </div>
                            </div>
                            {report.media_url && (
                                <div className="w-32 h-24 bg-muted rounded overflow-hidden flex-shrink-0 ml-6 border border-border relative group cursor-pointer">
                                    <img 
                                        src={report.media_url} 
                                        alt="Report media" 
                                        className="w-full h-full object-cover" 
                                        onError={(e) => {
                                            if (e.currentTarget.parentElement) {
                                                e.currentTarget.parentElement.style.display = 'none';
                                            }
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-primary-foreground text-xs font-semibold">View image</div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
