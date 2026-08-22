/**
 * @component App
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description Multi-Panel Outbreak Intelligence & Role-Based Dashboard Controller
 * @lastModified 2026-08-22
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import JudgeArena from './components/JudgeArena';
import SpatialMap from './components/SpatialMap';
import EpiCurve from './components/EpiCurve';
import PathogenProfiler from './components/PathogenProfiler';
import ActionMatrix from './components/ActionMatrix';
import CausalInvestigation from './components/CausalInvestigation';
import ContainmentCommander from './components/ContainmentCommander';
import StudentCheckIn from './components/StudentCheckIn';
import WardenPanel from './components/WardenPanel';
import MessPortal from './components/MessPortal';
import PrivacyHub from './components/PrivacyHub';
import JudgeAuthPortal from './components/JudgeAuthPortal';
import JudgeTourModal from './components/JudgeTourModal';
import { MOCK_USERS, getPersonaById } from './data/mockUsers';
import { fetchLiveRadar } from './api/client';
import { Shield, Activity, Users, AlertTriangle, CheckCircle2, ArrowUpRight, Droplets, Utensils, Lock, Microscope, ShieldAlert, Sliders, ArrowRight, Sparkles, Radio, RefreshCw, User, Award } from 'lucide-react';

export default function App() {
  // Authentication & Persona state - Starts with null so the Role Designation Portal opens first
  const [currentUser, setCurrentUser] = useState(null);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Active Tab state
  const [activeTab, setActiveTab] = useState('radar');
  
  // Live Radar State
  const [radarData, setRadarData] = useState({
    system_status: 'All Sensors Online 🟢',
    total_reports_24h: 0,
    active_clusters_count: 0,
    primary_risk_zone: null,
    highest_alert_level: 0,
    zones: [],
    clusters: [],
    epi_curve: [],
    last_updated: ''
  });
  const [selectedZone, setSelectedZone] = useState('Hostel_C_Fl_3');

  const refreshRadar = async () => {
    try {
      const data = await fetchLiveRadar();
      setRadarData(data);
    } catch (err) {
      console.error('Radar refresh error:', err);
    }
  };

  useEffect(() => {
    refreshRadar();
    const interval = setInterval(refreshRadar, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectUser = (user) => {
    setCurrentUser(user);
    setActiveTab(user.defaultTab || 'radar');
    setIsPersonaModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsPersonaModalOpen(false);
  };

  const handleSwitchPersonaFromArena = (personaId) => {
    const user = getPersonaById(personaId);
    handleSelectUser(user);
  };

  const handleStartTour = () => {
    if (!currentUser) {
      const judgeUser = getPersonaById('judge');
      setCurrentUser(judgeUser);
      setActiveTab('simulator');
    }
    setIsTourOpen(true);
  };

  // FIRST SCREEN: If user is not logged in, show the Role Designation Gateway
  if (!currentUser) {
    return (
      <div className="luminous-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <JudgeAuthPortal
          currentUser={null}
          onSelectUser={handleSelectUser}
          isModal={false}
          radarData={radarData}
          highestAlertLevel={radarData.highest_alert_level}
          onStartTour={handleStartTour}
        />

        {/* Floating 60-Second Tour Trigger Pill on Landing Page */}
        <button
          type="button"
          onClick={handleStartTour}
          className="pill-button"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9000,
            background: 'linear-gradient(135deg, var(--primary) 0%, #364B00 100%)',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.84rem',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 28px rgba(81, 102, 0, 0.4)',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1.0)'; }}
        >
          <Sparkles size={16} />
          <span>60s Grand Jury Tour 🚀</span>
        </button>

        <JudgeTourModal
          isOpen={isTourOpen}
          onClose={() => setIsTourOpen(false)}
          onNavigateTab={(t) => setActiveTab(t)}
        />
      </div>
    );
  }

  const isAlert = radarData.highest_alert_level >= 2;

  return (
    <div className="luminous-container">
      
      {/* 1. Sleek Navigation Header with Persona Profile Pill */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemStatus={radarData.system_status}
        highestAlertLevel={radarData.highest_alert_level}
        currentUser={currentUser}
        onOpenPersonaModal={() => setIsPersonaModalOpen(true)}
        onLogout={handleLogout}
        onStartTour={handleStartTour}
      />

      {/* 2. Contextual Persona Mandate Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, var(--surface-container-low) 100%)',
        border: '1px solid var(--surface-container)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px 20px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-full)',
            background: currentUser.avatarBg,
            color: currentUser.avatarColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            fontWeight: '800',
            flexShrink: 0
          }}>
            {currentUser.emoji}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--on-surface)' }}>
                Active Perspective: {currentUser.name} ({currentUser.roleLabel})
              </span>
              <span className={`pill-badge ${currentUser.badgeClass}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                🔒 {currentUser.clearance}
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>
              {currentUser.summary}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsPersonaModalOpen(true)}
            className="btn-ghost-pill"
            style={{ fontSize: '0.74rem', padding: '6px 14px', background: '#FFFFFF' }}
          >
            <RefreshCw size={12} />
            Switch Role / Persona
          </button>
        </div>
      </div>

      {/* 3. Premium Multi-Chip Telemetry Status Bar */}
      <div className="luminous-ticker-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={isAlert ? 'pulse-dot-red' : 'pulse-dot-green'}></span>
          <span style={{ fontWeight: '800', color: isAlert ? '#BA1A1A' : 'var(--primary)', letterSpacing: '0.04em', fontSize: '0.74rem' }}>
            {isAlert ? 'LIVE OUTBREAK RADAR' : 'LIVE BIO-RADAR STREAM'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          
          {/* Telemetry Chip: Water Residual Chlorine */}
          <div className={`telemetry-chip ${isAlert ? 'alert' : 'success'}`}>
            <Droplets size={12} />
            <span>RO-01 Chlorine: <strong>{isAlert ? '0.18 mg/L (⚠️ Dip)' : '0.52 mg/L (Optimal)'}</strong></span>
          </div>

          {/* Telemetry Chip: Dining Hazard */}
          <div className={`telemetry-chip ${isAlert ? 'alert' : ''}`}>
            <Utensils size={12} />
            <span>Mess 2 Service: <strong>{isAlert ? 'Palak Paneer (⚠️ Quarantined)' : 'Dinner Active'}</strong></span>
          </div>

          {/* Telemetry Chip: DPDP Privacy */}
          <div className="telemetry-chip">
            <Lock size={12} style={{ color: 'var(--tertiary)' }} />
            <span>DPDP: <strong>k-Anonymity (k&ge;5) Enforced</strong></span>
          </div>

          {/* Telemetry Chip: Poisson Scan Model */}
          <div className="telemetry-chip">
            <Radio size={12} style={{ color: 'var(--primary)' }} />
            <span>STPSS: <strong>Poisson Permutations (N=999)</strong></span>
          </div>

        </div>
      </div>

      {/* 4. Panel Views */}
      
      {/* ============================================================
          PANEL 1: SURVEILLANCE & EARLY WARNING RADAR (WAR ROOM)
          ============================================================ */}
      {activeTab === 'radar' && (
        <div>
          
          {/* Quick Access Action Bar to Cause Solver & Simulator */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            
            {/* Quick Card 1: Cause Solver */}
            <div
              onClick={() => setActiveTab('investigation')}
              className="luminous-card"
              style={{
                cursor: 'pointer',
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #FFFFFF 0%, var(--surface-container-low) 100%)',
                border: '1.5px solid var(--tertiary-fixed-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'transform 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--tertiary-container)',
                  color: 'var(--tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Microscope size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--on-surface)' }}>
                    Cause Solver Console
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--on-surface-variant)' }}>
                    Exposure Odds Ratios & Incubation Delta Fit
                  </div>
                </div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--tertiary)' }} />
            </div>

            {/* Quick Card 2: Containment Commander */}
            <div
              onClick={() => setActiveTab('commander')}
              className="luminous-card"
              style={{
                cursor: 'pointer',
                padding: '16px 20px',
                background: isAlert ? '#FFF5F5' : '#FFFFFF',
                border: `1.5px solid ${isAlert ? 'var(--error-container)' : 'var(--surface-container)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'transform 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-full)',
                  background: isAlert ? '#FFDAD6' : 'var(--surface-container-low)',
                  color: isAlert ? '#BA1A1A' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: isAlert ? '#BA1A1A' : 'var(--on-surface)' }}>
                    Containment Commander
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--on-surface-variant)' }}>
                    1-Click Food Lockdown & Sump Shock Dosing
                  </div>
                </div>
              </div>
              <ArrowRight size={16} style={{ color: isAlert ? '#BA1A1A' : 'var(--on-surface-variant)' }} />
            </div>

            {/* Quick Card 3: Judge Arena */}
            <div
              onClick={() => setActiveTab('simulator')}
              className="luminous-card"
              style={{
                cursor: 'pointer',
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #FFFFFF 0%, var(--surface-container-low) 100%)',
                border: '1.5px solid var(--primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'transform 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--primary-container)',
                  color: 'var(--on-primary-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sliders size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--on-surface)' }}>
                    Judge Evaluation Arena
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--on-surface-variant)' }}>
                    Scenario A vs Scenario B Live Math
                  </div>
                </div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--primary)' }} />
            </div>

          </div>

          {/* Top KPI Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            
            {/* Metric 1: Total Reports */}
            <div className="luminous-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: '600', color: 'var(--on-surface-variant)' }}>
                  Total 24h Reports
                </span>
                <span className="pill-badge badge-lime">
                  <ArrowUpRight size={12} /> Active Pulse
                </span>
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--on-surface)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {radarData.total_reports_24h}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)', marginTop: '6px' }}>
                15-second zero-friction pulses
              </div>
            </div>

            {/* Metric 2: Active Clusters */}
            <div className="luminous-card" style={{ padding: '20px', borderColor: radarData.active_clusters_count > 0 ? 'var(--error-container)' : 'var(--surface-container)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: '600', color: 'var(--on-surface-variant)' }}>
                  Statistical Clusters
                </span>
                <span className={`pill-badge ${radarData.active_clusters_count > 0 ? 'badge-crimson' : 'badge-lime'}`}>
                  {radarData.active_clusters_count > 0 ? 'p < 0.05' : 'p ≥ 0.05'}
                </span>
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: radarData.active_clusters_count > 0 ? 'var(--error)' : 'var(--on-surface)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {radarData.active_clusters_count}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)', marginTop: '6px' }}>
                STPSS Poisson Monte Carlo Scan
              </div>
            </div>

            {/* Metric 3: Primary Risk Zone */}
            <div className="luminous-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: '600', color: 'var(--on-surface-variant)' }}>
                  Primary Risk Zone
                </span>
                <span className="pill-badge badge-lavender">
                  Floor Micro-Scope
                </span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: radarData.primary_risk_zone ? 'var(--on-surface)' : 'var(--primary)', letterSpacing: '-0.01em', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {radarData.primary_risk_zone ? radarData.primary_risk_zone.replace(/_/g, ' ') : 'None (Baseline Clear)'}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)', marginTop: '8px' }}>
                Micro-spatial containment scope
              </div>
            </div>

            {/* Metric 4: Alert Level */}
            <div className="luminous-card" style={{ padding: '20px', borderColor: isAlert ? 'var(--error-container)' : 'var(--surface-container)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: '600', color: 'var(--on-surface-variant)' }}>
                  Institutional Alert
                </span>
                <span className={`pill-badge ${isAlert ? 'badge-crimson' : 'badge-lime'}`}>
                  {isAlert ? 'Level 2 Alert' : 'Normal'}
                </span>
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: isAlert ? 'var(--error)' : 'var(--primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Level {radarData.highest_alert_level}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)', marginTop: '6px' }}>
                {radarData.highest_alert_level === 0 ? 'Normal Baseline' : radarData.highest_alert_level === 1 ? 'Advisory Active' : 'Targeted Containment Active'}
              </div>
            </div>

          </div>

          {/* Grid Layout: Spatial Map + Epidemic Curve */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <SpatialMap
              zones={radarData.zones}
              selectedZone={selectedZone}
              onSelectZone={(zId) => setSelectedZone(zId)}
              userRole={currentUser?.role || 'cmo'}
            />
            <EpiCurve points={radarData.epi_curve} />
          </div>

          {/* Grid Layout: Pathogen Profiler + Quick Action Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '20px' }}>
            <PathogenProfiler clusters={radarData.clusters} />
            <ActionMatrix
              primaryRiskZone={radarData.primary_risk_zone}
              highestAlertLevel={radarData.highest_alert_level}
              onActionExecuted={refreshRadar}
            />
          </div>

        </div>
      )}

      {/* ============================================================
          PANEL 2: CAUSAL INVESTIGATION & ROOT CAUSE ENGINE
          ============================================================ */}
      {activeTab === 'investigation' && (
        <CausalInvestigation
          clusters={radarData.clusters}
          highestAlertLevel={radarData.highest_alert_level}
          onNavigateToCommander={() => setActiveTab('commander')}
        />
      )}

      {/* ============================================================
          PANEL 3: CONTAINMENT COMMANDER & EMERGENCY POWERS
          ============================================================ */}
      {activeTab === 'commander' && (
        <ContainmentCommander
          primaryRiskZone={radarData.primary_risk_zone}
          highestAlertLevel={radarData.highest_alert_level}
          onActionExecuted={refreshRadar}
        />
      )}

      {/* ============================================================
          PANEL 4: HACKATHON GRAND JURY ARENA & BENCHMARK SIMULATOR
          ============================================================ */}
      {activeTab === 'simulator' && (
        <JudgeArena
          onScenarioTriggered={refreshRadar}
          onSwitchPersona={handleSwitchPersonaFromArena}
        />
      )}

      {/* ============================================================
          PANEL 5: STUDENT CLINICAL PULSE & SELF-TRIAGE
          ============================================================ */}
      {activeTab === 'student' && (
        <StudentCheckIn onCheckinSuccess={refreshRadar} />
      )}

      {/* ============================================================
          PANEL 6: HOSTEL WARDEN GROUND OPERATIONS
          ============================================================ */}
      {activeTab === 'warden' && (
        <WardenPanel zone={selectedZone || 'Hostel_C_Fl_3'} />
      )}

      {/* ============================================================
          PANEL 7: DINING HALL & KITCHEN HACCP PORTAL
          ============================================================ */}
      {activeTab === 'mess' && (
        <MessPortal />
      )}

      {/* ============================================================
          PANEL 8: DPDP ACT 2023 PRIVACY & AUDIT VAULT
          ============================================================ */}
      {activeTab === 'dpdp' && (
        <PrivacyHub />
      )}

      {/* 5. Persona Switcher Modal Overlay */}
      {isPersonaModalOpen && (
        <JudgeAuthPortal
          currentUser={currentUser}
          onSelectUser={handleSelectUser}
          onClose={() => setIsPersonaModalOpen(false)}
          isModal={true}
          radarData={radarData}
          highestAlertLevel={radarData.highest_alert_level}
        />
      )}

      {/* 6. Interactive 60-Second Grand Jury Tour Modal */}
      <JudgeTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateTab={(t) => setActiveTab(t)}
      />

      {/* 7. Floating 60-Second Tour Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsTourOpen(true)}
        className="pill-button"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9000,
          background: 'linear-gradient(135deg, var(--primary) 0%, #364B00 100%)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.84rem',
          fontWeight: '800',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 28px rgba(81, 102, 0, 0.4)',
          border: '2px solid rgba(255, 255, 255, 0.25)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1.0)'; }}
      >
        <Sparkles size={16} />
        <span>60s Grand Jury Tour 🚀</span>
      </button>

      {/* 8. Footer Attribution */}
      <footer style={{
        marginTop: '44px',
        paddingTop: '20px',
        borderTop: '1px solid var(--surface-container-high)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        fontSize: '0.76rem',
        color: 'var(--on-surface-variant)'
      }}>
        <div>
          © 2026 <strong>Synthreaper</strong> | Project CHOWKI v1.0.0 — Continuous Health Observation & Water-Kitchen Intelligence
        </div>
        <div className="font-mono">
          STPSS (Poisson MC N=999) • Bayesian Attribution Engine • DPDP Act 2023 Compliant
        </div>
      </footer>

    </div>
  );
}
