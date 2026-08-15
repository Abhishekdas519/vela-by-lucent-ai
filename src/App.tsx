/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  ClientProfile, 
  Lead, 
  PricingPlan, 
  MinutePackage 
} from './types';
import { INITIAL_CLIENTS, INITIAL_LEADS, PRICING_PLANS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LiveVoiceDemo } from './components/LiveVoiceDemo';
import { ProofOfResults } from './components/ProofOfResults';
import { CompetitivePricing } from './components/CompetitivePricing';
import { AuthModal } from './components/AuthModal';
import { BuyMinutesModal } from './components/BuyMinutesModal';
import { AdminDashboard } from './components/AdminDashboard';
import { PortalLoginPage } from './components/PortalLoginPage';
import { ClientDashboard } from './components/ClientDashboard';
import { 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  PhoneCall, 
  Bot, 
  Lock, 
  Heart,
  ArrowUpRight
} from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'landing' | 'client_dashboard' | 'admin_dashboard' | 'portal_login'>('landing');
  
  // Data State
  const [clients, setClients] = useState<ClientProfile[]>(() => {
    const saved = localStorage.getItem('vela_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [activeClient, setActiveClient] = useState<ClientProfile>(() => {
    return clients[0] || INITIAL_CLIENTS[0];
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('vela_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vela_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isBuyMinutesOpen, setIsBuyMinutesOpen] = useState(false);
  const [selectedMinutePackage, setSelectedMinutePackage] = useState<MinutePackage | null>(null);
  
  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('vela_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('vela_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vela_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('vela_user');
    }
  }, [currentUser]);

  const [isPortalRoute, setIsPortalRoute] = useState(false);

  
  // Check for Subdomain (app. / admin.) or /login route
  useEffect(() => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    
    // Check if we are on a portal/admin subdomain OR portal paths
    const isPortalSubdomain = hostname.startsWith('app.') || hostname.startsWith('portal.') || hostname.startsWith('admin.');
    const isPortalPath = pathname === '/login' || pathname === '/portal' || pathname === '/admin' || pathname === '/app';

    if (isPortalSubdomain || isPortalPath) {
      // If user is already logged in, route them directly to their dashboard
      if (currentUser) {
        setCurrentView(currentUser.role === 'admin' ? 'admin_dashboard' : 'client_dashboard');
      } else {
        // Otherwise, show the dedicated Portal Login Page
        setCurrentView('portal_login');
      }
    } else {
      // We are on the main landing page
      if (currentUser && pathname === '/dashboard') {
         setCurrentView(currentUser.role === 'admin' ? 'admin_dashboard' : 'client_dashboard');
      }
    }
    
    // Listen for back/forward navigation
    const handlePopState = () => {
      if (window.location.pathname === '/login') setCurrentView('portal_login');
      else if (window.location.pathname === '/') setCurrentView('landing');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
    
  }, [currentUser]);


  // Auth Callbacks
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentView('admin_dashboard');
    } else {
      const matchedClient = clients.find(c => c.id === user.clientId) || clients[0];
      setActiveClient(matchedClient);
      setCurrentView('client_dashboard');
    }
  };

  const handleSignUpSuccess = (newClient: ClientProfile, newUser: User) => {
    const updatedClients = [newClient, ...clients];
    setClients(updatedClients);
    setActiveClient(newClient);
    setCurrentUser(newUser);
    setCurrentView('client_dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  // Plan Selection from Pricing
  const handleSelectPlan = (plan: PricingPlan) => {
    if (!currentUser) {
      setAuthMode('signup');
      setIsAuthModalOpen(true);
    } else {
      setIsBuyMinutesOpen(true);
    }
  };

  const handleSelectMinutePackage = (pkg: MinutePackage) => {
    setSelectedMinutePackage(pkg);
    setIsBuyMinutesOpen(true);
  };

  // Add Minutes Callback
  const handleMinutesPurchased = (addedMinutes: number) => {
    if (!activeClient) return;
    const updated = {
      ...activeClient,
      talktimeMinutesTotal: activeClient.talktimeMinutesTotal + addedMinutes
    };
    setActiveClient(updated);
    setClients(clients.map(c => c.id === updated.id ? updated : c));
  };

  // Admin Client Management
  const handleAddNewClient = (newClient: ClientProfile) => {
    setClients([newClient, ...clients]);
  };

  const handleUpdateClient = (updatedClient: ClientProfile) => {
    setActiveClient(updatedClient);
    setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleAdminSwitchToClient = (client: ClientProfile) => {
    setActiveClient(client);
    setCurrentView('client_dashboard');
  };

  const handleOpenBuyMinutesForClient = (client: ClientProfile) => {
    setActiveClient(client);
    setIsBuyMinutesOpen(true);
  };

  const scrollToDemo = () => {
    const element = document.getElementById('live-demo-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Universal Navigation Bar */}
      <Navbar
        currentView={currentView}
        currentUser={currentUser}
        activeClient={activeClient}
        onNavigate={(view) => setCurrentView(view)}
        onOpenLogin={() => { window.history.pushState({}, '', '/login'); setCurrentView('portal_login'); }}
        onOpenSignUp={() => {
          setAuthMode('signup');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenBuyMinutes={() => setIsBuyMinutesOpen(true)}
        
      />

      {/* Main View Container */}
      <main className="flex-1">
              {currentView === 'portal_login' && (
        <PortalLoginPage 
          onLoginSuccess={handleLoginSuccess}
          onNavigateHome={() => {
            window.history.pushState({}, '', '/');
            setCurrentView('landing');
          }}
        />
      )}
      {currentView === 'landing' && (
          <div className="space-y-0">
            {/* Hero Section */}
            <HeroSection
              onTryDemo={scrollToDemo}
              onOpenSignUp={() => {
                setAuthMode('signup');
                setIsAuthModalOpen(true);
              }}
              onOpenAdminConsole={() => {
                const adminUser: User = {
                  id: 'user-admin-1',
                  name: 'Alex Vance (Lead Architect)',
                  email: 'admin@lucent.ai',
                  role: 'admin',
                  companyName: 'Lucent AI Master Fleet',
                };
                handleLoginSuccess(adminUser);
              }}
            />

            {/* Interactive Live Voice Demo Playground */}
            <LiveVoiceDemo 
              onOpenSignUp={() => {
                setAuthMode('signup');
                setIsAuthModalOpen(true);
              }} 
            />

            {/* Proof of Results & Interactive ROI Savings Calculator */}
            <ProofOfResults
              onOpenSignUp={() => {
                setAuthMode('signup');
                setIsAuthModalOpen(true);
              }}
            />
          </div>
        )}

        {currentView === 'admin_dashboard' && (
          <AdminDashboard
            clients={clients}
            onAddNewClient={handleAddNewClient}
            onUpdateClient={handleUpdateClient}
            onSwitchToClientView={handleAdminSwitchToClient}
            onOpenBuyMinutesForClient={handleOpenBuyMinutesForClient}
          />
        )}

        {currentView === 'client_dashboard' && (
          <ClientDashboard
            client={activeClient}
            leads={leads}
            currentUser={currentUser}
            onUpdateClient={handleUpdateClient}
            onUpdateLeads={(updatedLeads) => setLeads(updatedLeads)}
            onOpenBuyMinutes={() => setIsBuyMinutesOpen(true)}
          />
        )}
      </main>

      {/* Enterprise Global Footer */}
      <footer className="bg-slate-50 border-t border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shadow-md">
                  V
                </div>
                <span className="text-base font-extrabold text-slate-900 tracking-tight">
                  Vela <span className="text-cyan-600 font-medium text-xs">by Lucent AI</span>
                </span>
              </div>
              <p className="text-slate-500 text-xs max-w-sm">
                Replacing manual outbound call center seats with sub-450ms autonomous voice agents. Guaranteed 10% lower pricing.
              </p>
            </div>

            {/* Platform Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                <span>Twilio SIP Attestation A</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-mono">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Vapi Real-Time Voice</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Gemini 3.7 Intelligence</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
            <div>
              © {new Date().getFullYear()} Lucent AI Technologies Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              
            </div>
          </div>

        </div>
      </footer>

      {/* Auth & Onboarding Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        isPortalRoute={isPortalRoute}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onSignUpSuccess={handleSignUpSuccess}
      />

      {/* Buy Minutes & Stripe Checkout Modal */}
      <BuyMinutesModal
        isOpen={isBuyMinutesOpen}
        client={activeClient}
        selectedPresetPackage={selectedMinutePackage}
        onClose={() => {
          setIsBuyMinutesOpen(false);
          setSelectedMinutePackage(null);
        }}
        onMinutesPurchased={handleMinutesPurchased}
      />

      

    </div>
  );
}
