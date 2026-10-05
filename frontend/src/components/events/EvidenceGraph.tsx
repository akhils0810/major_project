import { useState, useEffect } from 'react';
import { Activity, ShieldAlert, FileText, CheckCircle2, User, Camera, ShieldCheck, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface EvidenceGraphProps {
    eventId: string;
}

export default function EvidenceGraph({ eventId }: EvidenceGraphProps) {
    const [evidence, setEvidence] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchEvidence = async () => {
            try {
                const res = await fetch(`/api/v1/events/${eventId}/evidence`);
                if (res.ok) {
                    setEvidence(await res.json());
                }
            } catch (err) {
                console.error("Failed to fetch evidence", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvidence();
    }, [eventId]);
    
    if (loading) {
        return (
            <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }
    
    if (!evidence || evidence.nodes.length === 0) {
        return (
            <div className="py-12 text-center text-muted-foreground">
                <FileText className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No evidence nodes found for this event.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-background rounded-lg border border-border p-6 shadow-inner">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Activity className="text-primary" size={20} />
                        Weather Evidence Graph
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Timeline of {evidence.total_nodes} ingested nodes forming this macro-event.
                    </p>
                </div>
                {evidence.contradiction_count > 0 && (
                    <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                        <ShieldAlert size={14} />
                        {evidence.contradiction_count} CONTRADICTIONS DETECTED
                    </div>
                )}
            </div>
            
            <div className="relative border-l-2 border-border ml-3 space-y-8 pb-4">
                {evidence.nodes.map((node: any) => (
                    <div key={node.id} className="relative pl-6">
                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-background ${
                            node.is_contradiction ? 'bg-amber-500' : 'bg-primary'
                        }`}></div>
                        
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-bold text-foreground">{node.source_name}</span>
                                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-md uppercase tracking-wider font-semibold">
                                        {node.source_type}
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-auto">
                                        {format(new Date(node.timestamp), 'MMM d, HH:mm')}
                                    </span>
                                </div>
                                <div className="bg-card border border-border rounded-lg p-4 shadow-sm relative overflow-hidden">
                                    {node.is_contradiction && (
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full flex items-start justify-end p-2 border-l border-b border-amber-500/20">
                                            <ShieldAlert className="text-amber-500" size={14} />
                                        </div>
                                    )}
                                    <p className="text-sm text-foreground mb-3 pr-8">"{node.content}"</p>
                                    
                                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                                        {node.latitude && (
                                            <span className="flex items-center gap-1">
                                                <MapPin size={12} /> {node.latitude.toFixed(4)}, {node.longitude.toFixed(4)}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 size={12} className={node.confidence_score > 0.7 ? "text-emerald-500" : "text-muted-foreground"} /> 
                                            AI Confidence: {Math.round(node.confidence_score * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
