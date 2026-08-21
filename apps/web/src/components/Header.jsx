/**
 * @component Header
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description Sleek Luminous Navigation Header with Glassmorphic Tabs (Zero Scrollbars)
 * @lastModified 2026-08-22
 */

import React, { useState, useEffect } from 'react';
import { Radio, Microscope, ShieldAlert, Sliders, Activity, UserCheck, Utensils, Lock, Zap, Clock } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, systemStatus, highestAlertLevel }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const getAlertTag = () => {
    if (highestAlertLevel >= 2) {
      return (
        <span className="pill-badge badge-crimson" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span className="pulse-dot-red"></span>
          Level 2 Outbreak Alert
        </span>
      );
    } else if (highestAlertLevel === 1) {
      return (
        <span className="pill-badge badge-amber">
          ⚠️ Level 1 Advisory
        </span>
      );
    }
    return (
      <span className="pill-badge badge-lime" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <span className="pulse-dot-green"></span>
        Baseline Safe
      </span>
    );
  };

  const navItems = [
    { id: 'radar', label: 'Surveillance Radar', icon: Radio },
    { id: 'investigation', label: 'Cause Solver', icon: Microscope, highlight: highestAlertLevel >= 2 },
    { id: 'commander', label: 'Containment Commander', icon: ShieldAlert, highlight: highestAlertLevel >= 2 },
    { id: 'simulator', label: 'Benchmark Arena', icon: Sliders },
    { id: 'student', label: 'Student Pulse', icon: Activity },
    { id: 'warden', label: 'Hostel Warden', icon: UserCheck },
    { id: 'mess', label: 'Dining & HACCP', icon: Utensils },
    { id: 'dpdp', label: 'Privacy Vault', icon: Lock },
  ];

  return (
    <header style={{ marginBottom: '20px' }}>
      
      {/* Top Header Card */}
      <div className="luminous-card" style={{ padding: '16px 24px', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Brand Logo & Tagline */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
            onClick={() => setActiveTab('radar')}
          >

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--on-surface)' }}>
                  CHOWKI
                </h1>
                {getAlertTag()}
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--on-surface-variant)', fontWeight: '500' }}>
                Bio-Spatiotemporal Outbreak Surveillance & Micro-Containment Intelligence
              </p>
            </div>
          </div>

          {/* Right Live Clock & System Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'var(--surface-container-low)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: '700',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--on-surface)'
            }}>
              <Clock size={13} style={{ color: 'var(--primary)' }} />
              {timeStr} IST
            </div>
          </div>

        </div>

        {/* Clean, Elegant Nav Strip with NO Scrollbars */}
        <nav
          className="no-scrollbar"
          style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid var(--surface-container)',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  border: isActive ? '1.5px solid var(--on-primary-container)' : '1px solid transparent',
                  background: isActive
                    ? 'var(--primary-container)'
                    : item.highlight
                    ? '#FFF0F0'
                    : 'var(--surface-container-low)',
                  color: isActive
                    ? 'var(--on-primary-container)'
                    : item.highlight
                    ? '#BA1A1A'
                    : 'var(--on-surface)',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  boxShadow: isActive ? '0 4px 14px var(--primary-glow)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <Icon size={14} style={{ color: isActive ? 'var(--on-primary-container)' : item.highlight ? '#BA1A1A' : 'var(--primary)' }} />
                {item.label}
              </button>
            );
          })}
        </nav>

      </div>

    </header>
  );
}
