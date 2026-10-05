import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MinusCircle, Maximize2 } from 'lucide-react';

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'VARUNETRA AI online. I can analyze recent weather events, query source reliability, or summarize impact estimates. How can I assist?' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen && !isMinimized) {
            scrollToBottom();
        }
    }, [messages, isOpen, isMinimized]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            let reply = "I am processing that request through the intelligence layer.";
            if (userMsg.toLowerCase().includes('impact') || userMsg.toLowerCase().includes('event')) {
                reply = "Based on recent telemetry, Event #EV-405AFF67 (RAINFALL in City, Telangana) is showing critical infrastructure risks. Route NH-44 is currently BLOCKED. Would you like me to issue a rerouting protocol?";
            } else if (userMsg.toLowerCase().includes('source') || userMsg.toLowerCase().includes('trust')) {
                reply = "Social API ingestion is currently quarantined due to a trust score of 40% and 124 flagged false reports. Citizen Reports remain reliable at 72%.";
            } else if (userMsg.toLowerCase().includes('alert')) {
                reply = "Drafting a public advisory for the Telangana rainfall event. Shall I broadcast this to the National Disaster Response Force (NDRF) API?";
            }
            
            setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
        }, 1200);
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => { setIsOpen(true); setIsMinimized(false); }}
                className="fixed bottom-6 right-6 w-14 h-14 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 z-50 group"
            >
                <Bot size={28} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-background rounded-full animate-pulse"></span>
            </button>
        );
    }

    if (isMinimized) {
        return (
            <button 
                onClick={() => setIsMinimized(false)}
                className="fixed bottom-6 right-6 px-6 h-12 bg-card border border-border text-foreground rounded-full shadow-2xl flex items-center gap-3 transition-transform hover:scale-105 z-50 font-bold"
            >
                <div className="w-6 h-6 bg-teal-500/20 text-teal-500 rounded-full flex items-center justify-center">
                    <Bot size={14} />
                </div>
                Varunetra AI
                <Maximize2 size={14} className="text-muted-foreground ml-2" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-card border border-border shadow-2xl rounded-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="h-14 bg-muted/50 border-b border-border flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-500/20 text-teal-500 rounded-full flex items-center justify-center border border-teal-500/30">
                        <Bot size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-foreground leading-none">VARUNETRA AI</h3>
                        <span className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase flex items-center gap-1 mt-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Online
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMinimized(true)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-background rounded-md transition-colors">
                        <MinusCircle size={18} />
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-background rounded-md transition-colors">
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                            msg.role === 'user' 
                                ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                                : 'bg-card border border-border text-foreground rounded-tl-sm shadow-sm'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-border bg-card">
                <form onSubmit={handleSend} className="relative">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask VARUNETRA AI..."
                        className="w-full bg-background border border-input rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                    />
                    <button 
                        type="submit"
                        disabled={!input.trim()}
                        className="absolute right-1.5 top-1.5 bottom-1.5 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 transition-colors"
                    >
                        <Send size={14} className={input.trim() ? 'translate-x-[1px]' : ''} />
                    </button>
                </form>
            </div>
        </div>
    );
}
