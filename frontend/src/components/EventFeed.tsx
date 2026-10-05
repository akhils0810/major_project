import { format } from 'date-fns';
import { ShieldCheck, AlertTriangle, CloudRain, Wind, Sun, CloudLightning, Waves } from 'lucide-react';

interface EventData {
  id: string;
  title: string;
  event_category: string;
  city: string;
  verification_status: string;
  confidence_score: number;
  report_count: number;
  updated_at: string;
}

interface EventFeedProps {
  events: EventData[];
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'rainfall': return <CloudRain size={20} className="text-blue-400" />;
    case 'flooding': return <Waves size={20} className="text-cyan-400" />;
    case 'strong_winds': return <Wind size={20} className="text-teal-400" />;
    case 'heatwave': return <Sun size={20} className="text-orange-400" />;
    case 'thunderstorm': return <CloudLightning size={20} className="text-purple-400" />;
    default: return <AlertTriangle size={20} className="text-muted-foreground" />;
  }
};

export default function EventFeed({ events }: EventFeedProps) {
  // Sort by updated_at desc and only show VERIFIED
  const verifiedEvents = events
    .filter(e => e.verification_status === 'VERIFIED')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 10); // Show top 10 recent verified events

  if (verifiedEvents.length === 0) {
    return (
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl h-[400px] flex flex-col items-center justify-center text-center">
        <ShieldCheck size={48} className="text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-300">No Verified Events</h3>
        <p className="text-sm text-muted-foreground mt-2">Waiting for enough reports or official confirmation to verify active events.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden flex flex-col h-[400px]">
      <div className="p-4 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center sticky top-0">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="text-emerald-400" size={20} />
          <h2 className="font-bold text-primary-foreground tracking-wide">Verified Events Feed</h2>
        </div>
        <span className="text-xs font-medium bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20">
          {verifiedEvents.length} Active
        </span>
      </div>
      
      <div className="overflow-y-auto flex-1 p-4 space-y-4 custom-scrollbar">
        {verifiedEvents.map(event => (
          <div key={event.id} className="bg-gray-900/50 border border-gray-700 hover:border-gray-600 rounded-xl p-4 transition-all hover:shadow-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-800 p-2 rounded-lg border border-gray-700">
                  {getCategoryIcon(event.event_category)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-100 text-sm leading-tight">{event.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{event.city}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-emerald-400">{event.confidence_score.toFixed(1)}% Trust</div>
                <div className="text-[10px] text-muted-foreground mt-1">{format(new Date(event.updated_at), 'HH:mm')}</div>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between text-xs border-t border-gray-800 pt-3">
              <span className="text-muted-foreground">{event.report_count} clustered reports</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
