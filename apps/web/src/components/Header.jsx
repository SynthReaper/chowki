/**
 * @component Header
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description Sleek Luminous Navigation Header with Persona Profile Switcher and Glassmorphic Tabs
 * @lastModified 2026-08-22
 */

import React, { useState, useEffect } from 'react';
import { Radio, Microscope, ShieldAlert, Sliders, Activity, UserCheck, Utensils, Lock, Clock, LogOut, RefreshCw, User, Sparkles } from 'lucide-react';
import { getPersonaById } from '../data/mockUsers';

export default function Header({
  activeTab,
  setActiveTab,
  systemStatus,
  highestAlertLevel,
  currentUser,
  onOpenPersonaModal,
  onLogout
}) {
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

  // Master list of navigation tabs
  const allNavItems = [
    { id: 'radar', label: 'Surveillance Radar', icon: Radio },
    { id: 'investigation', label: 'Cause Solver', icon: Microscope, highlight: highestAlertLevel >= 2 },
    { id: 'commander', label: 'Containment Commander', icon: ShieldAlert, highlight: highestAlertLevel >= 2 },
    { id: 'simulator', label: 'Judge Arena', icon: Sliders, isJudgeSpecial: true },
    { id: 'student', label: 'Student Pulse', icon: Activity },
    { id: 'warden', label: 'Hostel Warden', icon: UserCheck },
    { id: 'mess', label: 'Dining & HACCP', icon: Utensils },
    { id: 'dpdp', label: 'Privacy Vault', icon: Lock },
  ];

  // Strictly query active persona security permissions from live data definition
  const activePersona = currentUser?.id ? getPersonaById(currentUser.id) : currentUser;
  const userAllowedTabs = activePersona?.allowedTabs || (currentUser?.allowedTabs || ['radar', 'warden']);
  const visibleNavItems = allNavItems.filter(item => userAllowedTabs.includes(item.id));

  return (
    <header style={{ marginBottom: '20px' }}>
      
      {/* Top Header Card */}
      <div className="luminous-card" style={{ padding: '16px 24px', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Left: Brand Logo & Tagline */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
            onClick={() => setActiveTab(currentUser?.defaultTab || 'radar')}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-full)',
              background: '#FFFFFF',
              border: '2px solid var(--primary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px var(--primary-glow)',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <img
                src="/chowki.png"
                alt="CHOWKI Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

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

          {/* Right: Active Persona Profile Card + Live Clock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            
            {/* Live Clock */}
            <div style={{
              background: 'var(--surface-container-low)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: '700',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--on-surface)'
            }}>
              <Clock size={12} style={{ color: 'var(--primary)' }} />
              {timeStr} IST
            </div>

            {/* Current Logged-in Persona Badge */}
            {currentUser && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--surface-container-low)',
                padding: '4px 6px 4px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--surface-container-high)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--radius-full)',
                    background: currentUser.avatarBg,
                    color: currentUser.avatarColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.95rem',
                    fontWeight: '800'
                  }}>
                    {currentUser.emoji}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--on-surface)', lineHeight: 1.1 }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--on-surface-variant)', fontWeight: '600' }}>
                      {currentUser.roleLabel}
                    </div>
                  </div>
                </div>

                {/* Switch Persona Button */}
                <button
                  type="button"
                  onClick={onOpenPersonaModal}
                  style={{
                    background: 'var(--primary-container)',
                    color: 'var(--on-primary-container)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    padding: '5px 12px',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 8px var(--primary-glow)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <RefreshCw size={11} />
                  Switch Role
                </button>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={onLogout}
                  title="Logout / Switch Account"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--on-surface-variant)'
                  }}
                >
                  <LogOut size={13} />
                </button>
              </div>
            )}

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
          {visibleNavItems.map((item) => {
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
                    : item.isJudgeSpecial
                    ? 'var(--tertiary-container)'
                    : item.highlight
                    ? '#FFF0F0'
                    : 'var(--surface-container-low)',
                  color: isActive
                    ? 'var(--on-primary-container)'
                    : item.isJudgeSpecial
                    ? 'var(--tertiary)'
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
                <Icon size={14} style={{ color: isActive ? 'var(--on-primary-container)' : item.isJudgeSpecial ? 'var(--tertiary)' : item.highlight ? '#BA1A1A' : 'var(--primary)' }} />
                {item.label}
                {item.isJudgeSpecial && (
                  <span style={{ fontSize: '0.66rem', background: '#FFFFFF', padding: '1px 5px', borderRadius: 'var(--radius-full)', fontWeight: '800' }}>
                    ⚖️
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>

    </header>
  );
}
