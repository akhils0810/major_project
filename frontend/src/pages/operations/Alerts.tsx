import { BellRing, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

const mockAlerts = [
    {
        id: 1,
        title: 'HIGH FLOOD ACTIVITY',
        location: 'Hyderabad, Telangana',
        desc: '12 new reports in the last 15 minutes in Kukatpally and Hi-Tech City areas.',
        severity: 'critical',
        time: 'Just now'
    },
    {
        id: 2,
        title: 'THUNDERSTORM CELL DETECTED',
        location: 'Visakhapatnam, Andhra Pradesh',
        desc: 'Rapidly developing storm cell detected by API sources and corroborated by 4 citizen reports.',
        severity: 'high',
        time: '42 mins ago'
    },
    {
        id: 3,
        title: 'HEATWAVE WARNING',
        location: 'Jaipur, Rajasthan',
        desc: 'Temperatures exceeding 45°C reported consistently over the last 3 hours.',
        severity: 'medium',
        time: '2 hours ago'
    },
    {
        id: 4,
        title: 'FOG VISIBILITY DROP',
        location: 'New Delhi, Delhi',
        desc: 'Visibility dropped below 50 meters in NCR region.',
        severity: 'low',
        time: '5 hours ago'
    }
];

export default function Alerts() {
    const getSeverityDetails = (severity: string) => {
        switch (severity) {
            case 'critical': 
                return { icon: AlertOctagon, color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200' };
            case 'high': 
                return { icon: AlertTriangle, color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-200' };
            case 'medium': 
                return { icon: BellRing, color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-200' };
            default: 
                return { icon: Info, color: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-200' };
        }
    };

    return (
        <div className="space-y-6 flex flex-col min-h-[calc(100vh-4rem)] p-6 -m-6 bg-background">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
                        Active Alerts
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        High-priority actionable intelligence based on real-time event thresholds.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {mockAlerts.map(alert => {
                    const details = getSeverityDetails(alert.severity);
                    const Icon = details.icon;
                    return (
                        <div key={alert.id} className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-foreground">{alert.title}</h3>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border ${details.bg} ${details.color} ${details.border}`}>
                                            {alert.severity}
                                        </span>
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground">{alert.time}</span>
                                </div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">{alert.location}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">{alert.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
