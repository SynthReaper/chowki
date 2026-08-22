/**
 * @component JudgeTourModal
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description Sleek Non-Blocking Floating Guided Copilot & Evaluation Tour for Grand Jury
 * @lastModified 2026-08-22
 */

import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, X, Shield, Microscope, ShieldAlert, Lock, Radio, Sliders, Play, Award, Minimize2, Maximize2, Compass } from 'lucide-react';

export default function JudgeTourModal({ isOpen, onClose, onNavigateTab }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) return null;

  const TOUR_STEPS = [
    {
      step: 1,
      tab: 'simulator',
      badge: 'Step 1: The Core Hackathon Dilemma',
      title: 'Real Outbreak vs. Noise',
      subtitle: 'Disambiguating authentic food/water contamination from background stomach upsets.',
      icon: Sliders,
      iconBg: '#EBE9FE',
      iconColor: '#59569D',
      content: (
        <div>
          <p style={{ fontSize: '0.82rem', color: 'var(--on-surface)', lineHeight: 1.45, marginBottom: '10px' }}>
            In a 2,500-student campus, stomach upsets happen daily. False alarms cause costly kitchen shutdowns.
          </p>
          <div style={{ background: 'var(--surface-container-low)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-container)' }}>
            <div style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
              💡 <strong>CHOWKI Solution:</strong> Poisson Space-Time Permutation (STPSS p &lt; 0.05) must agree with Bayesian Pathogen Attribution before alerts fire.
            </div>
          </div>
        </div>
      ),
      cta: 'Inspect Dual-Engine Math ➔'
    },
    {
      step: 2,
      tab: 'simulator',
      badge: 'Step 2: Mathematical Rigor (N=999)',
      title: 'Poisson STPSS & Bayesian Model',
      subtitle: 'Zero black-box hallucinations. 100% transparent statistical epidemiology.',
      icon: Radio,
      iconBg: '#F4FDE2',
      iconColor: '#364B00',
      content: (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-container)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)' }}>
                📐 STPSS POISSON
              </div>
              <div className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--on-surface)', fontWeight: '700' }}>
                LLR = 4.82 (p = 0.002)
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>
                N=999 Monte Carlo permutations.
              </div>
            </div>

            <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-container)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--tertiary)' }}>
                🔬 BAYESIAN MODEL
              </div>
              <div className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--on-surface)', fontWeight: '700' }}>
                P(S. aureus) = 82%
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>
                Log-normal incubation &Delta;t = 3.5h.
              </div>
            </div>
          </div>
        </div>
      ),
      cta: 'View Root Cause Investigation ➔'
    },
    {
      step: 3,
      tab: 'investigation',
      badge: 'Step 3: Root Cause Isolation',
      title: 'Exposure Odds Ratio (OR = 14.0)',
      subtitle: 'Palak Paneer isolated as primary vehicle (p < 0.001) while RO water acts as co-factor.',
      icon: Microscope,
      iconBg: '#FFE4E6',
      iconColor: '#BA1A1A',
      content: (
        <div>
          <p style={{ fontSize: '0.82rem', color: 'var(--on-surface)', lineHeight: 1.45, marginBottom: '8px' }}>
            Fisher Exact cross-tabulation proves <strong>Palak Paneer (OR=14.0, p &lt; 0.001)</strong> is the toxic vehicle, while Dal Tadka (OR=0.04) is protective.
          </p>
          <div style={{ fontSize: '0.74rem', color: 'var(--on-surface-variant)' }}>
            🧪 <strong>Water Telemetry:</strong> RO Sump C had a temporary chlorine dip to 0.18 mg/L.
          </div>
        </div>
      ),
      cta: 'Explore 1-Click Containment ➔'
    },
    {
      step: 4,
      tab: 'commander',
      badge: 'Step 4: Surgical Incident Command',
      title: 'Targeted Mitigation Powers',
      subtitle: 'Micro-containment without shutting down the entire 2,500-student university.',
      icon: ShieldAlert,
      iconBg: '#FFDAD6',
      iconColor: '#93000A',
      content: (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={12} style={{ color: 'var(--primary)' }} />
              <span><strong>1-Click Food Lockdown:</strong> Quarantines Palak Paneer batch.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={12} style={{ color: 'var(--primary)' }} />
              <span><strong>RO Shock Chlorination:</strong> Auto-elevates chlorine to 2.0 mg/L.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={12} style={{ color: 'var(--primary)' }} />
              <span><strong>Geo-Fenced Advisory:</strong> SMS only to Block C residents (k &ge; 5).</span>
            </div>
          </div>
        </div>
      ),
      cta: 'Verify DPDP Privacy Compliance ➔'
    },
    {
      step: 5,
      tab: 'dpdp',
      badge: 'Step 5: Zero-Knowledge Privacy',
      title: 'DPDP Act 2023 Statutory Compliance',
      subtitle: 'Salted SHA-256 tokens, k-anonymity (k≥5), and Section 8(7) data shredder.',
      icon: Lock,
      iconBg: '#F2EEFF',
      iconColor: '#59569D',
      content: (
        <div>
          <p style={{ fontSize: '0.82rem', color: 'var(--on-surface)', lineHeight: 1.45, marginBottom: '8px' }}>
            No student names or roll numbers stored. Identity is blinded at the client edge.
          </p>
          <div style={{ background: '#FAFDF0', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--on-surface)', fontWeight: '700' }}>
              ⚖️ Section 8(7) Right to Withdraw Consent:
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)' }}>
              Students can shred their health tokens with 1 click in the Student Pulse portal.
            </div>
          </div>
        </div>
      ),
      cta: 'Finish Tour & Start Evaluating 🏆'
    }
  ];

  const current = TOUR_STEPS[currentStep];
  const StepIcon = current.icon;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (onNavigateTab) {
        onNavigateTab(TOUR_STEPS[nextStep].tab);
      }
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      if (onNavigateTab) {
        onNavigateTab(TOUR_STEPS[prevStep].tab);
      }
    }
  };

  const handleJumpToStep = (index) => {
    setCurrentStep(index);
    if (onNavigateTab) {
      onNavigateTab(TOUR_STEPS[index].tab);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 10000,
        width: '460px',
        maxWidth: 'calc(100vw - 36px)',
        pointerEvents: 'auto'
      }}
    >
      <div
        className="luminous-card"
        style={{
          padding: isMinimized ? '14px 18px' : '22px 24px',
          borderRadius: 'var(--radius-xl)',
          background: '#FFFFFF',
          border: '2px solid var(--primary)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.22), 0 0 24px var(--primary-glow)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top Header & Window Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMinimized ? '0px' : '14px' }}>
          
          {/* Left Step Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pill-badge badge-lime" style={{ fontSize: '0.68rem', padding: '3px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Compass size={12} />
              Grand Jury Pitch Tour ({currentStep + 1}/{TOUR_STEPS.length})
            </span>
          </div>

          {/* Right Minimize & Close Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? 'Expand Tour Details' : 'Minimize Tour HUD'}
              style={{
                background: 'var(--surface-container-low)',
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
              {isMinimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
            </button>

            <button
              type="button"
              onClick={onClose}
              title="Close Tour"
              style={{
                background: 'var(--surface-container-low)',
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
              <X size={13} />
            </button>
          </div>

        </div>

        {/* Minimized Compact Bar View */}
        {isMinimized ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-full)',
                background: current.iconBg,
                color: current.iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <StepIcon size={14} />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--on-surface)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {current.title}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 0}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--surface-container)',
                  background: 'transparent',
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentStep === 0 ? 0.3 : 1
                }}
              >
                <ArrowLeft size={12} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="btn-lime"
                style={{
                  padding: '5px 12px',
                  fontSize: '0.74rem',
                  fontWeight: '800',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                <span>{currentStep < TOUR_STEPS.length - 1 ? 'Next' : 'Done'}</span>
                <ArrowRight size={12} style={{ marginLeft: '4px' }} />
              </button>
            </div>
          </div>
        ) : (
          /* Expanded Full Walkthrough View */
          <>
            {/* Step Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-full)',
                background: current.iconBg,
                color: current.iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <StepIcon size={18} />
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {current.badge}
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--on-surface)', letterSpacing: '-0.02em', marginTop: '1px' }}>
                  {current.title}
                </h3>
                <p style={{ fontSize: '0.74rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>
                  {current.subtitle}
                </p>
              </div>
            </div>

            {/* Step Body Content */}
            <div style={{ marginBottom: '16px' }}>
              {current.content}
            </div>

            {/* Step Jump Dots */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
              {TOUR_STEPS.map((step, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleJumpToStep(idx)}
                  title={`Jump to ${step.badge}`}
                  style={{
                    width: idx === currentStep ? '22px' : '7px',
                    height: '7px',
                    borderRadius: 'var(--radius-full)',
                    background: idx === currentStep ? 'var(--primary)' : idx < currentStep ? 'var(--primary-container)' : 'var(--surface-container-high)',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>

            {/* Footer Navigation Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--surface-container)', paddingTop: '14px' }}>
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 0}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--surface-container-high)',
                  background: 'transparent',
                  fontSize: '0.76rem',
                  fontWeight: '700',
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentStep === 0 ? 0.35 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowLeft size={13} />
                Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="btn-lime"
                style={{
                  padding: '8px 18px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 10px var(--primary-glow)'
                }}
              >
                <span>{current.cta}</span>
                {currentStep < TOUR_STEPS.length - 1 ? <ArrowRight size={13} /> : <Award size={13} />}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
