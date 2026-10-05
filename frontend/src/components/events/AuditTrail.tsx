import { ShieldAlert, Activity, CheckCircle2, RefreshCcw, User, Eye, Zap } from 'lucide-react';
import { format, subMinutes } from 'date-fns';

interface AuditTrailProps {
    eventId: string;
}

export default function AuditTrail({ eventId }: AuditTrailProps) {
    const now = new Date();
    
    // Simulate an audit trail
    const logs = [
        {
            id: 1,
            action: 'EVENT_CLUSTERED',
            description: 'AI model successfully fused 23 raw nodes into a single macro-event.',
            actor: 'SYSTEM',
            actorType: 'ai',
            timestamp: subMinutes(now, 140),
            icon: Zap
        },
        {
            id: 2,
            action: 'CONFIDENCE_UPDATED',
            description: 'Confidence score elevated from 68% to 91% following spatial density analysis.',
            actor: 'VARUNETRA_ML',
            actorType: 'ai',
            timestamp: subMinutes(now, 138),
            icon: Activity
        },
        {
            id: 3,
            action: 'IMPACT_ASSESSED',
            description: 'Generated regional impact estimates and flagged 2 logistics routes as at risk.',
            actor: 'SYSTEM',
            actorType: 'ai',
            timestamp: subMinutes(now, 120),
            icon: ShieldAlert
        },
        {
            id: 4,
            action: 'HUMAN_REVIEW',
            description: 'Event manually inspected and verified by Operations Desk.',
            actor: 'Opr. Sharma',
            actorType: 'human',
            timestamp: subMinutes(now, 45),
            icon: Eye
        },
        {
            id: 5,
            action: 'STATUS_VERIFIED',
            description: 'Event verification status updated from PENDING to VERIFIED.',
            actor: 'Opr. Sharma',
            actorType: 'human',
            timestamp: subMinutes(now, 45),
            icon: CheckCircle2
        },
        {
            id: 6,
            action: 'SYNC',
            description: 'Synchronized event data with external NDMA portal.',
            actor: 'API_GATEWAY',
            actorType: 'system',
            timestamp: subMinutes(now, 5),
            icon: RefreshCcw
        }
    ];

    return (
        <div className="bg-background rounded-lg border border-border p-6 shadow-inner">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Activity className="text-primary" size={20} />
                        Incident Audit Trail
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Immutable cryptographic log of AI and Human interactions with this event.
                    </p>
                </div>
            </div>

            <div className="relative border-l-2 border-border ml-3 space-y-8 pb-4">
                {logs.map((log) => {
                    const Icon = log.icon;
                    return (
                        <div key={log.id} className="relative pl-6">
                            <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center ${
                                log.actorType === 'human' ? 'bg-indigo-500' :
                                log.actorType === 'ai' ? 'bg-emerald-500' : 'bg-slate-500'
                            }`}>
                                <Icon size={10} className="text-white" />
                            </div>
                            
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-bold text-foreground uppercase tracking-wider">{log.action}</span>
                                    <span className="text-xs text-muted-foreground ml-auto font-mono">
                                        {format(log.timestamp, 'MMM d, HH:mm:ss')}
                                    </span>
                                </div>
                                <div className="bg-card border border-border rounded-lg p-3 shadow-sm">
                                    <p className="text-sm text-foreground mb-3">{log.description}</p>
                                    
                                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground pt-2 border-t border-border">
                                        <div className="flex items-center gap-1.5">
                                            {log.actorType === 'human' ? <User size={12} /> : <Zap size={12} />}
                                            Actor: {log.actor}
                                        </div>
                                        <div className="font-mono text-[10px] opacity-50">
                                            HASH: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
