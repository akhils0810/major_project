import { format } from 'date-fns';
import { Activity, Clock, FileWarning } from 'lucide-react';

interface ReportData {
  id: string;
  content: string;
  city: string;
  event_category: string;
  timestamp: string;
  is_duplicate: boolean;
}

interface ReportFeedProps {
  reports: ReportData[];
}

export default function ReportFeed({ reports }: ReportFeedProps) {
  // Only show the most recent raw reports, excluding duplicates for a cleaner feed
  const recentReports = reports
    .filter(r => !r.is_duplicate)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 15);

  if (recentReports.length === 0) {
    return (
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl h-[400px] flex flex-col items-center justify-center text-center">
        <FileWarning size={48} className="text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-300">No Recent Reports</h3>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden flex flex-col h-[400px]">
      <div className="p-4 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center sticky top-0">
        <div className="flex items-center space-x-2">
          <Activity className="text-blue-400" size={20} />
          <h2 className="font-bold text-primary-foreground tracking-wide">Live Report Stream</h2>
        </div>
        <span className="text-xs font-medium bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20 flex items-center">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse mr-1.5"></span>
          Live
        </span>
      </div>
      
      <div className="overflow-y-auto flex-1 p-4 space-y-3 custom-scrollbar">
        {recentReports.map(report => (
          <div key={report.id} className="bg-gray-900/40 rounded-lg p-3 border-l-2 border-blue-500 hover:bg-gray-900/60 transition-colors">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">{report.event_category}</span>
              <span className="text-[10px] text-muted-foreground flex items-center">
                <Clock size={10} className="mr-1" />
                {format(new Date(report.timestamp), 'HH:mm')}
              </span>
            </div>
            <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
              "{report.content}"
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              {report.city || 'Unknown Location'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
