import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import AIAssistant from './AIAssistant';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../services/auth';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    if (!isAuthenticated()) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className="min-h-screen bg-background flex font-sans text-foreground">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 p-6 overflow-auto bg-muted/10">
                    <div className="max-w-[1600px] mx-auto w-full">
                        {children}
                    </div>
                </main>
                <AIAssistant />
            </div>
        </div>
    );
}
