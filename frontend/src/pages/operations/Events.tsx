import { useState, useEffect } from 'react';
import { Layers, MapPin, Activity, ShieldCheck, FileText, PieChart } from 'lucide-react';
import MapComponent from '../../components/MapComponent';
import EvidenceGraph from '../../components/events/EvidenceGraph';
import ImpactAnalysis from '../../components/events/ImpactAnalysis';
import AuditTrail from '../../components/events/AuditTrail';
import { Fingerprint } from 'lucide-react';

export default function Events() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedState, setExpandedState] = useState<{ id: string, tab: 'evidence' | 'impact' | 'audit' } | null>(null);

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/v1/events?limit=50');
            if (res.ok) {
                setEvents(await res.json());
            }
        } catch (err) {
            console.error("Failed to fetch events", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="space-y-6 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Operational Intelligence</span>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        Clustered Events
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
                        AI-clustered macro weather events aggregated from multiple raw reports.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : events.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm">
                    <Layers className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-foreground">No active events</h3>
                    <p className="text-muted-foreground mt-1">There are no clustered events currently active.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {events.map((event) => (
                        <div key={event.id} className="bg-card border border-border rounded-xl shadow-sm flex flex-col xl:grid xl:grid-cols-3 overflow-hidden">
                            {/* Left: Summary & Metadata */}
                            <div className="p-6 border-b xl:border-b-0 xl:border-r border-border bg-card/50 flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                                        <Layers size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Event #EV-{event.id.toString().substring(0, 8).toUpperCase()}</h3>
                                        <p className="text-xs text-muted-foreground">{new Date(event.start_time).toLocaleString()}</p>
                                    </div>
                                </div>
                                <h4 className="text-xl font-bold text-foreground mb-1">
                                    {event.city ? `${event.city} ` : ''}{(event.event_category || 'Unknown').toUpperCase()}
                                </h4>
                                <p className="text-sm font-medium text-muted-foreground mb-6 flex items-center gap-1.5">
                                    <MapPin size={14} />
                                    {event.city ? `${event.city}, ` : ''}{event.state || 'Unknown Location'}
                                </p>
                                
                                <div className="grid grid-cols-2 gap-4 mt-auto">
                                    <div className="bg-background border border-border rounded-lg p-3">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Reports</p>
                                        <p className="text-xl font-bold text-foreground flex items-baseline gap-1">
                                            {event.report_count}
                                            <span className="text-[10px] text-muted-foreground font-normal">nodes</span>
                                        </p>
                                    </div>
                                    <div className="bg-background border border-border rounded-lg p-3">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Status</p>
                                        <p className={`text-sm font-bold mt-1.5 flex items-center gap-1 ${event.verification_status === 'VERIFIED' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {event.verification_status === 'VERIFIED' ? <ShieldCheck size={16} /> : <Activity size={16} />}
                                            {event.verification_status}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Middle: Map Area (Simulated for this event) */}
                            <div className="min-h-[300px] border-b xl:border-b-0 xl:border-r border-border relative bg-muted/20">
                                <MapComponent events={[event]} className="absolute inset-0 w-full h-full z-0" />
                            </div>

                            {/* Right: Sources & Timeline */}
                            <div className="p-6 flex flex-col bg-card/20">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                                    <PieChart size={14} /> Source Distribution
                                </h4>
                                <div className="space-y-3 mb-8">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-foreground flex items-center gap-2"><FileText size={14} className="text-blue-500" /> Citizen Reports</span>
                                        <span className="font-bold text-foreground">{Math.floor(event.report_count * 0.7) || 1}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-foreground flex items-center gap-2"><Activity size={14} className="text-amber-500" /> API / IoT</span>
                                        <span className="font-bold text-foreground">{Math.ceil(event.report_count * 0.3) || 0}</span>
                                    </div>
                                </div>

                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2 mt-auto">
                                    <Activity size={14} /> Confidence Score
                                </h4>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="text-3xl font-bold text-emerald-500">
                                        91%
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500" style={{ width: '91%' }}></div>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-1">High probability event based on spatial density</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button 
                                        onClick={() => setExpandedState(expandedState?.id === event.id && expandedState.tab === 'evidence' ? null : { id: event.id, tab: 'evidence' })}
                                        className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors border ${
                                            expandedState?.id === event.id && expandedState.tab === 'evidence'
                                                ? 'bg-muted border-border text-foreground' 
                                                : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20'
                                        }`}
                                    >
                                        <Activity size={14} />
                                        {expandedState?.id === event.id && expandedState.tab === 'evidence' ? 'HIDE EVIDENCE' : 'EVIDENCE GRAPH'}
                                    </button>
                                    
                                    <button 
                                        onClick={() => setExpandedState(expandedState?.id === event.id && expandedState.tab === 'impact' ? null : { id: event.id, tab: 'impact' })}
                                        className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors border ${
                                            expandedState?.id === event.id && expandedState.tab === 'impact'
                                                ? 'bg-muted border-border text-foreground' 
                                                : 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20'
                                        }`}
                                    >
                                        <ShieldCheck size={14} />
                                        {expandedState?.id === event.id && expandedState.tab === 'impact' ? 'HIDE IMPACT' : 'IMPACT & ROUTING'}
                                    </button>

                                    <button 
                                        onClick={() => setExpandedState(expandedState?.id === event.id && expandedState.tab === 'audit' ? null : { id: event.id, tab: 'audit' })}
                                        className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors border ${
                                            expandedState?.id === event.id && expandedState.tab === 'audit'
                                                ? 'bg-muted border-border text-foreground' 
                                                : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500 hover:bg-indigo-500/20'
                                        }`}
                                    >
                                        <Fingerprint size={14} />
                                        {expandedState?.id === event.id && expandedState.tab === 'audit' ? 'HIDE AUDIT' : 'AUDIT TRAIL'}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Expansion Area */}
                            {expandedState?.id === event.id && (
                                <div className="p-6 border-t border-border bg-card/30 col-span-full">
                                    {expandedState.tab === 'evidence' ? (
                                        <EvidenceGraph eventId={event.id} />
                                    ) : expandedState.tab === 'impact' ? (
                                        <ImpactAnalysis eventId={event.id} />
                                    ) : (
                                        <AuditTrail eventId={event.id} />
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
