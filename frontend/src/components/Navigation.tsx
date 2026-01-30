import React from 'react';
import { useState } from 'react';
import {
  MessageCircle,
  Wallet,
  Search,
  ShieldCheck,
  User,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TabType } from '@/types';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'chat' as TabType, label: 'Chat Assistant', icon: MessageCircle },
  { id: 'budget' as TabType, label: 'Budget Manager', icon: Wallet },
  { id: 'schemes' as TabType, label: 'Scheme Lookup', icon: Search },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              FinGuard
            </span>
          </div>

          {/* Tabs */}
          <nav className="flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`nav-tab flex items-center gap-2 ${
                    isActive ? 'nav-tab-active' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition"
            >
              <User className="w-5 h-5 text-primary" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 card-elevated p-2 shadow-lg">
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate('/profile');
                  }}
                  className="dropdown-item flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>

                <button
                  onClick={() => {
                    setOpen(false);
                    navigate('/auth');
                  }}
                  className="dropdown-item flex items-center gap-2  mt-2 text-red-500"
                >
                  <LogOut className="w-4 h-4 " />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
