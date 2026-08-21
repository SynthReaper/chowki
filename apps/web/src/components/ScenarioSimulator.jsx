/**
 * @component ScenarioSimulator
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description Outbreak Disambiguation Controller for Hackathon Demonstrations
 * @lastModified 2026-08-22
 */

import React, { useState } from 'react';
import { AlertOctagon, CheckCircle2, RotateCcw, Zap, Terminal, Sparkles } from 'lucide-react';
import { triggerOutbreakScenario, triggerCoincidentalScenario, resetScenario } from '../api/client';

export default function ScenarioSimulator({ onScenarioTriggered }) {
  const [loading, setLoading] = useState(false);
  const [activeScenario, setActiveScenario] = useState('none');
  const [logText, setLogText] = useState('System ready • Dual-Engine Epidemiological Scan active.');

  const handleOutbreak = async () => {
    setLoading(true);
    try {
      await triggerOutbreakScenario();
      setActiveScenario('outbreak');
      setLogText('🚨 Scenario A Injected: 5 cases in Block C Fl 3 (Palak Paneer link, Δt=4.5h, Cl2=0.18 mg/L) ➔ STPSS p=0.002, Bayes P=88.4% ➔ Level 2 Red Alert');
      if (onScenarioTriggered) onScenarioTriggered();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCoincidental = async () => {
    setLoading(true);
    try {
      await triggerCoincidentalScenario();
      setActiveScenario('coincidental');
      setLogText('🟢 Scenario B Injected: 4 scattered cases in Blocks A,B,D over 36h (Zomato/exam noise) ➔ STPSS p=0.48, Bayes P=12.1% ➔ Level 0 Normal Baseline');
      if (onScenarioTriggered) onScenarioTriggered();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      await resetScenario();
      setActiveScenario('none');
      setLogText('✨ Campus surveillance telemetry reset to clean baseline.');
      if (onScenarioTriggered) onScenarioTriggered();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="luminous-card" style={{ marginBottom: '20px', padding: '18px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        
        {/* Left: AI Disambiguation Description */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--tertiary-container)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--tertiary)'
          }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--on-surface)' }}>
                Live Disambiguation Benchmark Simulator
              </span>
              <span className="pill-badge badge-lavender">
                Dual-Engine AI
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)' }}>
              Tests mathematical separation of point-source food poisoning from background exam stress.
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleOutbreak}
            disabled={loading}
            className="btn-crimson"
          >
            <AlertOctagon size={15} />
            Scenario A: Real Outbreak
          </button>

          <button
            onClick={handleCoincidental}
            disabled={loading}
            className="btn-lime"
          >
            <CheckCircle2 size={15} />
            Scenario B: Coincidental Upsets
          </button>

          <button
            onClick={handleReset}
            disabled={loading}
            className="btn-ghost-pill"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

      </div>

      {/* Terminal Log */}
      <div style={{
        marginTop: '12px',
        padding: '10px 16px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-container-low)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.76rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: activeScenario === 'outbreak' ? 'var(--error)' : activeScenario === 'coincidental' ? 'var(--primary)' : 'var(--on-surface-variant)'
      }}>
        <Terminal size={14} style={{ color: 'var(--tertiary)' }} />
        <span style={{ fontWeight: '500' }}>{logText}</span>
      </div>
    </div>
  );
}
