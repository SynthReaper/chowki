/**
 * @component JudgeTourModal
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description Interactive 60-Second Grand Jury Guided Pitch & Evaluation Tour
 * @lastModified 2026-08-22
 */

import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, X, Shield, Microscope, ShieldAlert, Lock, Radio, Sliders, Play, Award } from 'lucide-react';

export default function JudgeTourModal({ isOpen, onClose, onNavigateTab }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const TOUR_STEPS = [
    {
      step: 1,
      tab: 'simulator',
      badge: 'Step 1: The Core Hackathon Dilemma',
      title: 'Real Outbreak vs. Exam Stress Indigestion',
      subtitle: 'How does CHOWKI disambiguate authentic food/water contamination from background noise?',
      icon: Sliders,
      iconBg: '#EBE9FE',
      iconColor: '#59569D',
      content: (
        <div>
          <p style={{ fontSize: '0.86rem', color: 'var(--on-surface)', lineHeight: 1.5, marginBottom: '14px' }}>
            In a 2,500-student campus, random stomach upsets happen daily from exam anxiety, late-night tea, and spicy canteen snacks. False alarms cause panic and costly kitchen shutdowns.
          </p>
          <div style={{ background: 'var(--surface-container-low)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-container)' }}>
            <strong style={{ fontSize: '0.82rem', color: 'var(--on-surface)', display: 'block', marginBottom: '4px' }}>
              💡 The CHOWKI Solution:
            </strong>
            <div style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
              A <strong>Dual-Engine AI</strong> where Space-Time Permutation Scan Statistics (STPSS Poisson p &lt; 0.05) must mathematically agree with Multi-Parametric Bayesian Pathogen Attribution before any containment alert is issued.
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
      title: 'Poisson STPSS & Bayesian Attribution',
      subtitle: 'Zero black-box AI hallucinations. 100% transparent statistical epidemiology.',
      icon: Radio,
      iconBg: '#F4FDE2',
      iconColor: '#364B00',
      content: (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-container)' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
                📐 TIER 1: STPSS POISSON
              </div>
              <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--on-surface)' }}>
                LLR = 4.82 (p = 0.002)
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>
                N=999 Monte Carlo permutations confirm contiguous room clustering.
              </div>
            </div>

            <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-container)' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--tertiary)', marginBottom: '4px' }}>
                🔬 TIER 2: BAYESIAN MODEL
              </div>
              <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--on-surface)' }}>
                P(S. aureus) = 82%
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>
                Log-normal incubation fit on &Delta;t = 3.5h dinner delay.
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
      title: 'Exposure Odds Ratio Matrix (OR = 14.2)',
      subtitle: 'Cross-tabulation isolate the suspect dish while proving water is a secondary co-factor.',
      icon: Microscope,
      iconBg: '#FFE4E6',
      iconColor: '#BA1A1A',
      content: (
        <div>
          <p style={{ fontSize: '0.84rem', color: 'var(--on-surface)', lineHeight: 1.5, marginBottom: '10px' }}>
            The <strong>Cause Solver</strong> executes Fisher Exact tests across all menu items. <strong>Palak Paneer (OR=14.0, p &lt; 0.001)</strong> is mathematically proven to be the primary toxic vehicle, while Dal Tadka (OR=0.04) is protective.
          </p>
          <div style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)' }}>
            🧪 <strong>Water Telemetry:</strong> RO Sump C had a temporary chlorine dip to 0.18 mg/L, acting as an environmental vulnerability catalyst.
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: 'var(--on-surface-variant)', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} style={{ color: 'var(--primary)' }} />
              <span><strong>1-Click Food Lockdown:</strong> Quarantines Palak Paneer batch across campus kitchens.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} style={{ color: 'var(--primary)' }} />
              <span><strong>RO Shock Chlorination:</strong> Auto-elevates free chlorine to 2.0 mg/L.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} style={{ color: 'var(--primary)' }} />
              <span><strong>Geo-Fenced Advisory:</strong> Sends SMS/WhatsApp only to Block C residents (k &ge; 5).</span>
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
      subtitle: 'Salted SHA-256 tokens, k-anonymity (k≥5), and Section 8(7) instant data shredder.',
      icon: Lock,
      iconBg: '#F2EEFF',
      iconColor: '#59569D',
      content: (
        <div>
          <p style={{ fontSize: '0.84rem', color: 'var(--on-surface)', lineHeight: 1.5, marginBottom: '10px' }}>
            No student names or raw roll numbers are ever stored in the database. When students submit a health pulse, their identity is cryptographically blinded at the client edge.
          </p>
          <div style={{ background: '#FAFDF0', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary)' }}>
            <div style={{ fontSize: '0.76rem', color: 'var(--on-surface)', fontWeight: '700' }}>
              ⚖️ Section 8(7) Statutory Right to Withdraw Consent:
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)' }}>
              Students can shred their health records and tokens with 1 click in the Student Pulse terminal.
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

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(25, 28, 31, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div
        className="luminous-card"
        style={{
          width: '100%',
          maxWidth: '640px',
          padding: '32px',
          borderRadius: 'var(--radius-xl)',
          background: '#FFFFFF',
          border: '1.5px solid var(--primary-container)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.25)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'var(--surface-container-low)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--on-surface-variant)'
          }}
        >
          <X size={16} />
        </button>

        {/* Top Progress Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === currentStep ? '28px' : '8px',
                  height: '8px',
                  borderRadius: 'var(--radius-full)',
                  background: i === currentStep ? 'var(--primary)' : i < currentStep ? 'var(--primary-container)' : 'var(--surface-container-high)',
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </div>

          <span className="pill-badge badge-lavender" style={{ fontSize: '0.72rem' }}>
            Tour Step {currentStep + 1} of {TOUR_STEPS.length}
          </span>
        </div>

        {/* Step Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-full)',
            background: current.iconBg,
            color: current.iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <StepIcon size={22} />
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {current.badge}
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--on-surface)', letterSpacing: '-0.02em', marginTop: '2px' }}>
              {current.title}
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>
              {current.subtitle}
            </p>
          </div>
        </div>

        {/* Step Body */}
        <div style={{ marginBottom: '24px' }}>
          {current.content}
        </div>

        {/* Footer Navigation Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--surface-container)', paddingTop: '16px' }}>
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--surface-container-high)',
              background: 'transparent',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              opacity: currentStep === 0 ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={14} />
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="btn-lime"
            style={{
              padding: '10px 20px',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{current.cta}</span>
            {currentStep < TOUR_STEPS.length - 1 ? <ArrowRight size={14} /> : <Award size={14} />}
          </button>
        </div>

      </div>
    </div>
  );
}
