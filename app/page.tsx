'use client';

import { useState, useEffect } from 'react';
import { Onboarding } from '@/components/onboarding';
import { Dashboard } from '@/components/dashboard';
import type { UserSettings } from '@/lib/types';

const STORAGE_KEY = 'plane-spotter-settings';

function getStoredSettings(): UserSettings | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const settings = JSON.parse(stored);
      if (settings.onboardingComplete) {
        return settings;
      }
    }
  } catch (e) {
    console.error('Error reading settings:', e);
  }
  return null;
}

function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

export default function PlaneSpotter() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const stored = getStoredSettings();
    setSettings(stored);
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = (newSettings: UserSettings) => {
    saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleSettingsChange = (newSettings: UserSettings) => {
    saveSettings(newSettings);
    setSettings(newSettings);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background scanlines">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto">
            <svg className="w-full h-full text-primary glow-pulse" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
              <path
                d="M50,50 L50,5 A45,45 0 0,1 95,50 Z"
                fill="url(#sweep-load)"
                className="radar-sweep"
              />
              <circle cx="50" cy="50" r="3" fill="currentColor" />
              <defs>
                <linearGradient id="sweep-load" x1="50%" y1="0%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className="text-primary text-sm">INITIALIZING...</p>
        </div>
      </div>
    );
  }

  // Show onboarding if not completed
  if (!settings?.onboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Show dashboard
  return (
    <Dashboard 
      initialSettings={settings} 
      onSettingsChange={handleSettingsChange}
    />
  );
}
