import React, { useState } from 'react';
import { CloudRain, CloudLightning, Waves, Sun, CloudFog, Wind, Loader2, MapPin, CheckCircle2, ArrowLeft, Search, Activity, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const CATEGORIES = [
  { id: 'rainfall', label: 'Rainfall', icon: CloudRain, color: 'text-blue-500' },
  { id: 'thunderstorm', label: 'Thunderstorm', icon: CloudLightning, color: 'text-indigo-400' },
  { id: 'flooding', label: 'Flooding', icon: Waves, color: 'text-cyan-500' },
  { id: 'heatwave', label: 'Heatwave', icon: Sun, color: 'text-orange-500' },
  { id: 'fog', label: 'Fog', icon: CloudFog, color: 'text-slate-400' },
  { id: 'dust_storm', label: 'Dust Storm', icon: Wind, color: 'text-amber-500' },
  { id: 'strong_winds', label: 'Strong Winds', icon: Wind, color: 'text-teal-500' },
];

export default function CitizenReport() {
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('unknown');
    const [city, setCity] = useState('');
    const [stateName, setStateName] = useState('');
    const [lat, setLat] = useState<number | null>(null);
    const [lon, setLon] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [submittedReportId, setSubmittedReportId] = useState<number | null>(null);

    // Tracking state
    const location = useLocation();
    const initialTab = location.state?.activeTab || 'submit';
    const [activeTab, setActiveTab] = useState<'submit' | 'track'>(initialTab);
    const [trackId, setTrackId] = useState('');
    const [trackStatus, setTrackStatus] = useState<any>(null);
    const [trackLoading, setTrackLoading] = useState(false);
    const [trackError, setTrackError] = useState('');

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLat(position.coords.latitude);
                    setLon(position.coords.longitude);
                },
                (err) => {
                    setError('Unable to retrieve your location');
                }
            );
        } else {
            setError('Geolocation is not supported by your browser');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const payload = {
                content,
                event_category: category,
                city: city || null,
                state: stateName || null,
                latitude: lat,
                longitude: lon,
            };

            const response = await fetch('/api/v1/reports/citizen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to submit report. Please try again.');
            }

            const data = await response.json();
            setSubmittedReportId(data.id);
            setSuccess(true);
            // Reset form
            setContent('');
            setCategory('unknown');
            setCity('');
            setStateName('');
            setLat(null);
            setLon(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setTrackLoading(true);
        setTrackError('');
        setTrackStatus(null);
        
        try {
            // Mock tracking response based on ID
            await new Promise(resolve => setTimeout(resolve, 800));
            const idNum = parseInt(trackId.replace(/[^0-9]/g, ''), 10);
            
            if (isNaN(idNum) || idNum < 1) {
                throw new Error("Invalid Report ID format");
            }
            
            // Generate deterministic mock status
            const isVerified = idNum % 3 === 0;
            const isRejected = idNum % 5 === 0;
            const status = isVerified ? 'VERIFIED' : isRejected ? 'REJECTED' : 'PENDING';
            const confidence = isVerified ? 94 : isRejected ? 12 : 68;
            
            setTrackStatus({
                id: `WR-${2026000 + idNum}`,
                status,
                confidence,
                timestamp: new Date().toISOString(),
                message: isVerified 
                    ? "Your report has been successfully verified by AI and human operators and is now actively warning others."
                    : isRejected
                    ? "Your report was analyzed but could not be corroborated with surrounding sensor data or satellite imagery."
                    : "Your report is currently under review by our AI intelligence engine and operational desk."
            });
        } catch (err: any) {
            setTrackError(err.message);
        } finally {
            setTrackLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-card rounded-xl shadow-lg p-8 border border-border text-center">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 border border-emerald-500/20">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-3">Report Submitted</h2>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">Your report has been received and is being processed by our AI verification engine.</p>
                    
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">Your Tracking ID</span>
                        <span className="text-2xl font-mono font-bold text-foreground">WR-{2026000 + (submittedReportId || 1)}</span>
                        <p className="text-[10px] text-muted-foreground mt-2">Save this ID to track the status of your report.</p>
                    </div>

                    <div className="space-y-3">
                        <button 
                            onClick={() => { setSuccess(false); setSubmittedReportId(null); }}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-4 rounded-md transition-colors text-sm"
                        >
                            Submit Another Report
                        </button>
                        <Link to="/" className="w-full flex items-center justify-center bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-2.5 px-4 rounded-md transition-colors text-sm border border-border">
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-2xl mx-auto">
                <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Home
                </Link>
                
                <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
                    <div className="flex border-b border-border">
                        <button 
                            onClick={() => setActiveTab('submit')}
                            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'submit' ? 'bg-background text-foreground border-b-2 border-primary' : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'}`}
                        >
                            <FileText size={16} />
                            Submit Report
                        </button>
                        <button 
                            onClick={() => setActiveTab('track')}
                            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'track' ? 'bg-background text-foreground border-b-2 border-primary' : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'}`}
                        >
                            <Search size={16} />
                            Track Report Status
                        </button>
                    </div>

                    {activeTab === 'submit' ? (
                        <div className="p-6 sm:p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Citizen Weather Report</h2>
                                <p className="mt-2 text-muted-foreground text-sm">Help us monitor severe weather events by sharing what you see.</p>
                            </div>

                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 text-destructive-foreground p-3 rounded-md mb-6 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-3">What kind of event are you reporting?</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {CATEGORIES.map((cat) => {
                                            const Icon = cat.icon;
                                            const isSelected = category === cat.id;
                                            return (
                                                <button
                                                    type="button"
                                                    key={cat.id}
                                                    onClick={() => setCategory(cat.id)}
                                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
                                                        isSelected 
                                                        ? 'bg-primary/10 border-primary text-primary shadow-sm shadow-primary/5' 
                                                        : 'bg-background border-border text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/50'
                                                    }`}
                                                >
                                                    <Icon className={`w-6 h-6 mb-2 ${isSelected ? '' : 'opacity-70'}`} />
                                                    <span className="text-xs font-medium text-center">{cat.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Description</label>
                                    <textarea
                                        required
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={4}
                                        className="w-full bg-background border border-input text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground resize-none"
                                        placeholder="Describe what you are seeing (e.g. Heavy waterlogging near the main intersection...)"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">City</label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="w-full bg-background border border-input text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
                                            placeholder="e.g. Hyderabad"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">State</label>
                                        <input
                                            type="text"
                                            value={stateName}
                                            onChange={(e) => setStateName(e.target.value)}
                                            className="w-full bg-background border border-input text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
                                            placeholder="e.g. Telangana"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Precise Location (Optional)</label>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            type="button"
                                            onClick={handleGetLocation}
                                            className="flex items-center space-x-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border px-3 py-2 rounded-md transition-colors text-sm font-medium"
                                        >
                                            <MapPin size={16} />
                                            <span>Use Current Location</span>
                                        </button>
                                        {lat && lon && (
                                            <span className="text-emerald-500 text-xs font-mono bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20 flex items-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></div>
                                                {lat.toFixed(4)}, {lon.toFixed(4)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-6 mt-6 border-t border-border">
                                    <button
                                        type="submit"
                                        disabled={loading || category === 'unknown'}
                                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-4 rounded-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={16} /> : <span>Submit Report</span>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="p-6 sm:p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center justify-center gap-2">
                                    <Activity className="text-primary" />
                                    Track Your Report
                                </h2>
                                <p className="mt-2 text-muted-foreground text-sm">See how your contribution is helping the Varunetra network.</p>
                            </div>

                            {trackError && (
                                <div className="bg-destructive/10 border border-destructive/20 text-destructive-foreground p-3 rounded-md mb-6 text-sm">
                                    {trackError}
                                </div>
                            )}

                            <form onSubmit={handleTrack} className="space-y-4 mb-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Tracking ID</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            required
                                            value={trackId}
                                            onChange={(e) => setTrackId(e.target.value)}
                                            className="flex-1 bg-background border border-input text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground font-mono"
                                            placeholder="e.g. WR-2026001"
                                        />
                                        <button
                                            type="submit"
                                            disabled={trackLoading || !trackId}
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 rounded-md transition-all flex items-center justify-center disabled:opacity-50 text-sm"
                                        >
                                            {trackLoading ? <Loader2 className="animate-spin" size={16} /> : 'Track'}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {trackStatus && (
                                <div className="bg-background border border-border rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="font-mono font-bold text-foreground">{trackStatus.id}</span>
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-widest border ${
                                            trackStatus.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                            trackStatus.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                        }`}>
                                            {trackStatus.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground leading-relaxed mb-6">
                                        {trackStatus.message}
                                    </p>
                                    
                                    <div className="border-t border-border pt-4">
                                        <div className="flex justify-between text-xs font-medium mb-1.5">
                                            <span className="text-muted-foreground">AI Verification Confidence</span>
                                            <span className="text-foreground">{trackStatus.confidence}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${trackStatus.confidence > 70 ? 'bg-emerald-500' : trackStatus.confidence > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                style={{ width: `${trackStatus.confidence}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
