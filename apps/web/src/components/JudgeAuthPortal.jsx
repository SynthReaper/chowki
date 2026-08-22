/**
 * @component JudgeAuthPortal
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description Hackathon Grand Jury & Role Designation Entry Portal with Live Campus Advisory Feed
 * @lastModified 2026-08-22
 */

import React, { useState } from 'react';
import { MOCK_USERS, authenticateMockUser } from '../data/mockUsers';
import { Shield, Key, ArrowRight, CheckCircle2, UserCheck, Microscope, ShieldAlert, Utensils, Activity, X, Sparkles, Lock, Zap, Radio, Sliders, AlertTriangle, Droplets, MapPin, Bell, Megaphone } from 'lucide-react';

export default function JudgeAuthPortal({ currentUser, onSelectUser, onClose, isModal = false }) {
  const [activeMode, setActiveMode] = useState('personas'); // 'personas' | 'manual'
  const [email, setEmail] = useState('judge@hackathon.ai');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleManualLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = authenticateMockUser(email, password);
    if (res.success) {
      onSelectUser(res.user);
      if (onClose) onClose();
    } else {
      setErrorMsg(res.error);
    }
  };

  const handleQuickSelect = (user) => {
    onSelectUser(user);
    if (onClose) onClose();
  };

  const handleFillCredentials = (mock) => {
    setEmail(mock.email);
    setPassword('password123');
    setErrorMsg('');
  };

  return (
    <div style={{
      position: isModal ? 'fixed' : 'relative',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isModal ? 'rgba(25, 28, 31, 0.75)' : 'transparent',
      backdropFilter: isModal ? 'blur(8px)' : 'none',
      zIndex: isModal ? 9999 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isModal ? '20px' : '36px 16px',
      minHeight: isModal ? 'auto' : '100vh'
    }}>
      <div
        className="luminous-card"
        style={{
          width: '100%',
          maxWidth: '1140px',
          maxHeight: isModal ? '90vh' : 'none',
          overflowY: 'auto',
          padding: isModal ? '32px' : '40px 36px',
          borderRadius: 'var(--radius-xl)',
          boxShadow: isModal ? '0 20px 60px rgba(0, 0, 0, 0.2)' : '0 16px 48px rgba(0, 0, 0, 0.04)',
          border: '1.5px solid var(--surface-container-high)',
          background: '#FFFFFF',
          position: 'relative'
        }}
      >
        {/* Close button for modal */}
        {isModal && onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'var(--surface-container-low)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--on-surface-variant)',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={18} />
          </button>
        )}

        {/* 1. LIVE CAMPUS HEALTH ADVISORY & BREAKING NEWS BULLETIN */}
        <div style={{
          background: 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 100%)',
          border: '1.5px solid var(--error-container)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 20px',
          marginBottom: '28px',
          boxShadow: '0 4px 14px rgba(186, 26, 26, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse-dot-red"></span>
              <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#BA1A1A', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                🚨 LIVE CAMPUS EPIDEMIOLOGICAL ADVISORY & HEALTH BULLETIN
              </span>
            </div>
            <span className="pill-badge badge-crimson" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
              Level 2 Targeted Advisory
            </span>
          </div>

          <p style={{ fontSize: '0.84rem', color: '#191C1F', lineHeight: 1.45, fontWeight: '600', marginBottom: '10px' }}>
            Micro-outbreak cluster confirmed in <strong>Hostel Block C (Floor 3)</strong>. Suspect dish <strong>Mess 2 Palak Paneer</strong> has been quarantined. Free WHO-ORS packets are available at the <strong>Warden Desk (Ground Floor)</strong>. RO sump chlorination elevated to <strong>2.0 mg/L</strong>.
          </p>

          {/* Live Telemetry Breaking News Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div className="telemetry-chip alert" style={{ fontSize: '0.7rem', padding: '3px 10px' }}>
              <Droplets size={12} />
              <span>RO-01 Chlorine: <strong>0.18 mg/L (⚠️ Auto-Dosing)</strong></span>
            </div>
            <div className="telemetry-chip alert" style={{ fontSize: '0.7rem', padding: '3px 10px' }}>
              <Utensils size={12} />
              <span>Mess 2 Service: <strong>Palak Paneer Quarantined</strong></span>
            </div>
            <div className="telemetry-chip" style={{ fontSize: '0.7rem', padding: '3px 10px' }}>
              <UserCheck size={12} style={{ color: 'var(--primary)' }} />
              <span>Warden Block C: <strong>Doorstep Delivery Active</strong></span>
            </div>
            <div className="telemetry-chip" style={{ fontSize: '0.7rem', padding: '3px 10px' }}>
              <Lock size={12} style={{ color: '#59569D' }} />
              <span>DPDP Vault: <strong>17 Pulses Anonymized (k&ge;5)</strong></span>
            </div>
          </div>
        </div>

        {/* 2. Unified Hero Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          
          {/* Logo Badge Container */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 16px',
            background: '#FFFFFF',
            border: '1.5px solid var(--primary-container)',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 4px 14px var(--primary-glow)',
            marginBottom: '14px',
            gap: '10px'
          }}>
            <img
              src="/chowki.png"
              alt="CHOWKI Logo"
              style={{
                width: '28px',
                height: '28px',
                objectFit: 'contain'
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span style={{
              fontSize: '0.8rem',
              fontWeight: '800',
              color: 'var(--on-surface)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              Project CHOWKI Suite
            </span>
          </div>

          <h1 style={{
            fontSize: isModal ? '1.6rem' : '2.1rem',
            fontWeight: '800',
            color: 'var(--on-surface)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '8px'
          }}>
            {isModal ? 'Switch Stakeholder Perspective' : 'Bio-Spatiotemporal Outbreak Surveillance Radar'}
          </h1>
          
          <p style={{
            fontSize: '0.88rem',
            color: 'var(--on-surface-variant)',
            maxWidth: '740px',
            margin: '0 auto 16px auto',
            lineHeight: 1.5,
            fontWeight: '500'
          }}>
            Continuous Health Observation & Water-Kitchen Intelligence for Indian Campuses. Select a stakeholder role below to launch their specialized operational workspace.
          </p>

          {/* Mode Switcher */}
          <div style={{
            display: 'inline-flex',
            gap: '6px',
            background: 'var(--surface-container-low)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--surface-container)'
          }}>
            <button
              type="button"
              onClick={() => setActiveMode('personas')}
              style={{
                padding: '7px 20px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                background: activeMode === 'personas' ? '#FFFFFF' : 'transparent',
                color: activeMode === 'personas' ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                boxShadow: activeMode === 'personas' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              ⚡ 1-Click Role Login ({MOCK_USERS.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('manual')}
              style={{
                padding: '7px 20px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                background: activeMode === 'manual' ? '#FFFFFF' : 'transparent',
                color: activeMode === 'manual' ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                boxShadow: activeMode === 'manual' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              🔑 Manual Mock Login Form
            </button>
          </div>
        </div>

        {/* 3. MODE 1: 1-CLICK PERSONA CARDS */}
        {activeMode === 'personas' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '16px' }}>
            {MOCK_USERS.map((user) => {
              const isCurrent = currentUser?.id === user.id;
              return (
                <div
                  key={user.id}
                  onClick={() => handleQuickSelect(user)}
                  style={{
                    background: isCurrent ? 'linear-gradient(135deg, #FAFDF0 0%, #FFFFFF 100%)' : '#FFFFFF',
                    border: `1.5px solid ${isCurrent ? 'var(--primary)' : 'var(--surface-container)'}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '22px',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isCurrent ? '0 8px 24px var(--primary-glow)' : 'var(--shadow-soft)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = isCurrent ? 'var(--primary)' : 'var(--surface-container)';
                    e.currentTarget.style.boxShadow = isCurrent ? '0 8px 24px var(--primary-glow)' : 'var(--shadow-soft)';
                  }}
                >
                  {isCurrent && (
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'var(--primary-container)',
                      color: 'var(--on-primary-container)',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.68rem',
                      fontWeight: '800'
                    }}>
                      CURRENT ROLE
                    </span>
                  )}

                  <div>
                    {/* User Avatar + Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-full)',
                        background: user.avatarBg,
                        color: user.avatarColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        flexShrink: 0,
                        border: '1px solid rgba(0,0,0,0.06)'
                      }}>
                        {user.emoji}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--on-surface)' }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--on-surface-variant)', fontWeight: '600' }}>
                          {user.title}
                        </div>
                      </div>
                    </div>

                    {/* Role Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <span className={`pill-badge ${user.badgeClass}`}>
                        {user.roleLabel}
                      </span>
                      <span style={{
                        background: 'var(--surface-container-low)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.68rem',
                        fontWeight: '700',
                        color: 'var(--on-surface-variant)'
                      }}>
                        🔒 {user.clearance}
                      </span>
                    </div>

                    {/* Mandate Summary */}
                    <p style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', lineHeight: 1.4, marginBottom: '14px' }}>
                      {user.summary}
                    </p>

                    {/* Capabilities bullets */}
                    <div style={{ borderTop: '1px solid var(--surface-container-low)', paddingTop: '10px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--on-surface)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Designated Dashboard Powers:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {user.keyCapabilities.slice(0, 3).map((cap, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.72rem', color: 'var(--on-surface-variant)' }}>
                            <CheckCircle2 size={12} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                            <span>{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Login CTA */}
                  <button
                    type="button"
                    className="pill-button"
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      background: isCurrent ? 'var(--primary)' : 'var(--primary-container)',
                      color: isCurrent ? '#FFFFFF' : 'var(--on-primary-container)',
                      fontSize: '0.82rem',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      border: 'none',
                      borderRadius: 'var(--radius-full)',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px var(--primary-glow)'
                    }}
                  >
                    <span>Launch {user.roleLabel} Dashboard</span>
                    <ArrowRight size={14} />
                  </button>

                </div>
              );
            })}
          </div>
        )}

        {/* 4. MODE 2: MANUAL FORM WITH QUICK-FILL CHIPS */}
        {activeMode === 'manual' && (
          <div style={{ maxWidth: '520px', margin: '0 auto' }}>
            
            {/* Quick Fill Pills */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '8px' }}>
                CLICK TO AUTO-FILL MOCK CREDENTIALS:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {MOCK_USERS.map((mock) => (
                  <button
                    key={mock.id}
                    type="button"
                    onClick={() => handleFillCredentials(mock)}
                    style={{
                      background: email === mock.email ? 'var(--primary-container)' : 'var(--surface-container-low)',
                      color: email === mock.email ? 'var(--on-primary-container)' : 'var(--on-surface)',
                      border: '1px solid var(--surface-container)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{mock.emoji}</span>
                    <span>{mock.email}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleManualLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: 'var(--on-surface)', marginBottom: '6px' }}>
                  Institutional / Judge Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. judge@hackathon.ai"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--surface-container-high)',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: 'var(--on-surface)', marginBottom: '6px' }}>
                  Password / Passcode
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="password123"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--surface-container-high)',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    outline: 'none'
                  }}
                />
              </div>

              {errorMsg && (
                <div style={{
                  background: 'var(--error-container)',
                  color: 'var(--on-error-container)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.78rem',
                  fontWeight: '700'
                }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="btn-lime"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.9rem',
                  justifyContent: 'center',
                  marginTop: '6px'
                }}
              >
                <Key size={16} />
                Authenticate & Open Designated Dashboard
              </button>

            </form>

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.74rem', color: 'var(--on-surface-variant)' }}>
              🔒 Protected by Project CHOWKI Zero-Trust Mock Identity Provider
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
