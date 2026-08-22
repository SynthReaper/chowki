/**
 * @component JudgeArena
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description Dedicated Hackathon Grand Jury Evaluation Hub & Mathematical Proof Arena
 * @lastModified 2026-08-22
 */

import React, { useState } from 'react';
import { Sliders, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Activity, Database, Lock, Terminal, Cpu, FileCheck, Layers } from 'lucide-react';
import ScenarioSimulator from './ScenarioSimulator';

export default function JudgeArena({ onScenarioTriggered, onSwitchPersona }) {
  const [activeProofTab, setActiveProofTab] = useState('truthTable'); // 'truthTable' | 'stpssMath' | 'bayesianMath' | 'dpdpCompliance'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Grand Jury Banner */}
      <div className="luminous-card" style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, var(--surface-container-low) 100%)',
        border: '1.5px solid var(--tertiary-fixed-dim)',
        padding: '24px 28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="pill-badge badge-lavender" style={{ fontSize: '0.76rem' }}>
                ⚖️ HACKATHON GRAND JURY EVALUATION ARENA
              </span>
              <span className="pill-badge badge-lime">
                Full Algorithmic Transparency
              </span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>
              Dual-Engine Outbreak Disambiguation & Verification Arena
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--on-surface-variant)', maxWidth: '780px', marginTop: '4px' }}>
              Test and audit how Project CHOWKI mathematically differentiates true point-source food poisoning from coincidental exam stress noise using <strong>Poisson Space-Time Permutation Scans ($N=999$)</strong> and <strong>Multi-Parametric Bayesian Attribution</strong>.
            </p>
          </div>

          {/* Quick Stakeholder Switcher Bar */}
          <div style={{ background: '#FFFFFF', padding: '12px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-container)', boxShadow: 'var(--shadow-soft)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--on-surface-variant)', marginBottom: '8px' }}>
              INSTANT STAKEHOLDER PERSPECTIVE TOUR:
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => onSwitchPersona('cmo')}
                className="btn-ghost-pill"
                style={{ padding: '4px 10px', fontSize: '0.74rem' }}
              >
                👨‍⚕️ CMO View
              </button>
              <button
                type="button"
                onClick={() => onSwitchPersona('warden')}
                className="btn-ghost-pill"
                style={{ padding: '4px 10px', fontSize: '0.74rem' }}
              >
                👨‍✈️ Warden View
              </button>
              <button
                type="button"
                onClick={() => onSwitchPersona('mess')}
                className="btn-ghost-pill"
                style={{ padding: '4px 10px', fontSize: '0.74rem' }}
              >
                🍽️ Mess View
              </button>
              <button
                type="button"
                onClick={() => onSwitchPersona('student')}
                className="btn-ghost-pill"
                style={{ padding: '4px 10px', fontSize: '0.74rem' }}
              >
                🎓 Student View
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Live Benchmark Scenario Switcher Component */}
      <ScenarioSimulator onScenarioTriggered={onScenarioTriggered} />

      {/* Mathematical Proof & Architectural Inspector */}
      <div className="luminous-card" style={{ padding: '24px' }}>
        
        {/* Proof Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--surface-container)', paddingBottom: '14px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--on-surface)' }}>
              Algorithmic Proofs & Compliance Scorecards
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)' }}>
              Select a verification dimension to audit mathematical models and legal safeguards.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px', background: 'var(--surface-container-low)', padding: '4px', borderRadius: 'var(--radius-full)' }}>
            <button
              type="button"
              onClick={() => setActiveProofTab('truthTable')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '0.76rem',
                fontWeight: '700',
                cursor: 'pointer',
                background: activeProofTab === 'truthTable' ? '#FFFFFF' : 'transparent',
                color: activeProofTab === 'truthTable' ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                boxShadow: activeProofTab === 'truthTable' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              📊 Truth Table Benchmark
            </button>
            <button
              type="button"
              onClick={() => setActiveProofTab('stpssMath')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '0.76rem',
                fontWeight: '700',
                cursor: 'pointer',
                background: activeProofTab === 'stpssMath' ? '#FFFFFF' : 'transparent',
                color: activeProofTab === 'stpssMath' ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                boxShadow: activeProofTab === 'stpssMath' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              📐 STPSS Poisson Math (N=999)
            </button>
            <button
              type="button"
              onClick={() => setActiveProofTab('bayesianMath')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '0.76rem',
                fontWeight: '700',
                cursor: 'pointer',
                background: activeProofTab === 'bayesianMath' ? '#FFFFFF' : 'transparent',
                color: activeProofTab === 'bayesianMath' ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                boxShadow: activeProofTab === 'bayesianMath' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              🔬 Bayesian Attribution
            </button>
            <button
              type="button"
              onClick={() => setActiveProofTab('dpdpCompliance')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '0.76rem',
                fontWeight: '700',
                cursor: 'pointer',
                background: activeProofTab === 'dpdpCompliance' ? '#FFFFFF' : 'transparent',
                color: activeProofTab === 'dpdpCompliance' ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                boxShadow: activeProofTab === 'dpdpCompliance' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              🔒 DPDP Act 2023 Proof
            </button>
          </div>
        </div>

        {/* TAB 1: TRUTH TABLE BENCHMARK */}
        {activeProofTab === 'truthTable' && (
          <div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-container-low)', textAlign: 'left', borderBottom: '1px solid var(--surface-container)' }}>
                    <th style={{ padding: '12px', fontWeight: '700' }}>Surveillance Dimension</th>
                    <th style={{ padding: '12px', fontWeight: '700', color: '#BA1A1A' }}>Scenario A: True Point-Source Food Outbreak</th>
                    <th style={{ padding: '12px', fontWeight: '700', color: 'var(--primary)' }}>Scenario B: Coincidental Exam Noise / Stress</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--surface-container-low)' }}>
                    <td style={{ padding: '12px', fontWeight: '700' }}>Spatial Distribution</td>
                    <td style={{ padding: '12px' }}>Concentrated in <strong>Hostel Block C, Floor 3</strong> (Adjacent rooms 302–306)</td>
                    <td style={{ padding: '12px' }}>Scattered across <strong>Block A, B, C, D</strong> (1 case per block)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--surface-container-low)' }}>
                    <td style={{ padding: '12px', fontWeight: '700' }}>Temporal Dynamics</td>
                    <td style={{ padding: '12px' }}>Acute spike within 4-hour window (&Delta;t = 3.5h)</td>
                    <td style={{ padding: '12px' }}>Evenly dispersed over 36 hours (Random background noise)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--surface-container-low)' }}>
                    <td style={{ padding: '12px', fontWeight: '700' }}>STPSS Poisson p-Value</td>
                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: '800', color: '#BA1A1A' }}>
                      p = 0.002 (Statistically Significant &lt; 0.05)
                    </td>
                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--primary)' }}>
                      p = 0.88 (Within Poisson Random Expectation)
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--surface-container-low)' }}>
                    <td style={{ padding: '12px', fontWeight: '700' }}>Exposure Odds Ratio (OR)</td>
                    <td style={{ padding: '12px' }}><strong>Mess 2 Palak Paneer (OR = 14.2, p &lt; 0.001)</strong></td>
                    <td style={{ padding: '12px' }}>Diverse independent meals (Maggie, Dal, External Canteen)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--surface-container-low)' }}>
                    <td style={{ padding: '12px', fontWeight: '700' }}>Symptom Co-occurrence</td>
                    <td style={{ padding: '12px' }}>Acute Upper GI: Projectile Vomiting + Nausea + Abdominal Cramps</td>
                    <td style={{ padding: '12px' }}>Non-specific: Acidity, Headache, Mild Stress Indigestion</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--surface-container-low)' }}>
                    <td style={{ padding: '12px', fontWeight: '700' }}>Water Telemetry Prior</td>
                    <td style={{ padding: '12px' }}>Free Chlorine dipped to <strong>0.18 mg/L</strong> (Elevates Prior)</td>
                    <td style={{ padding: '12px' }}>Free Chlorine optimal at <strong>0.52 mg/L</strong></td>
                  </tr>
                  <tr style={{ background: 'var(--surface-container-low)' }}>
                    <td style={{ padding: '12px', fontWeight: '800' }}>CHOWKI Final Decision</td>
                    <td style={{ padding: '12px', fontWeight: '800', color: '#BA1A1A' }}>🚨 LEVEL 2 TARGETED OUTBREAK CONTAINMENT</td>
                    <td style={{ padding: '12px', fontWeight: '800', color: 'var(--primary)' }}>🟢 BASELINE SAFE — ZERO FALSE ALARMS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: STPSS POISSON MATHEMATICAL PROOF */}
        {activeProofTab === 'stpssMath' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            
            <div style={{ background: 'var(--surface-container-low)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Formula 1: Marginal Poisson Expectation
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', fontWeight: '700', background: '#FFFFFF', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '10px' }}>
                &mu;<sub>zt</sub> = (C<sub>z</sub> &middot; C<sub>t</sub>) / C
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
                Calculates expected cases in zone <em>z</em> during time window <em>t</em> conditional on the observed spatial and temporal marginal totals. Completely neutralizes daily diurnal reporting rhythms.
              </p>
            </div>

            <div style={{ background: 'var(--surface-container-low)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Formula 2: Log-Likelihood Ratio (LLR)
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: '700', background: '#FFFFFF', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '10px' }}>
                LLR = c &middot; ln(c / &mu;) + (C - c) &middot; ln((C - c) / (C - &mu;))
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
                Evaluates the Poisson probability of observing <em>c</em> cases versus baseline &mu;. Maximum likelihood cylinder identifies the exact micro-spatial epicenter.
              </p>
            </div>

            <div style={{ background: 'var(--surface-container-low)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Formula 3: Monte Carlo Permutation (N=999)
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', fontWeight: '700', background: '#FFFFFF', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '10px' }}>
                p = (Rank<sub>obs</sub> + 1) / (N + 1)
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
                Shuffles spatial labels across temporal bins 999 times to generate the empirical null distribution without assuming asymptotic normality.
              </p>
            </div>

          </div>
        )}

        {/* TAB 3: BAYESIAN ATTRIBUTION PROOF */}
        {activeProofTab === 'bayesianMath' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: 'var(--inverse-surface)', color: 'var(--inverse-on-surface)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#D9FF5F', textTransform: 'uppercase', marginBottom: '6px' }}>
                Bayesian Vector Update Formulation
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#FFFFFF', marginBottom: '10px' }}>
                P(Pathogen<sub>k</sub> | S, &Delta;t, M<sub>k</sub>, W) = [ P<sub>prior</sub>(k) &middot; L(S|k) &middot; L(&Delta;t|k) &middot; L(M<sub>k</sub>|k) &middot; L(W|k) ] / &Sigma; P(evidence)
              </div>
              <p style={{ fontSize: '0.8rem', color: '#D8DADE', lineHeight: 1.5 }}>
                Evaluates 5 microbiological candidate profiles (<em>S. aureus</em>, <em>B. cereus</em>, <em>Salmonella enterica</em>, <em>Norovirus</em>, <em>E. coli STEC</em>) by convolving incubation Gaussian probability densities with symptom cosine similarity and meal exposure matrices.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div className="luminous-card" style={{ padding: '14px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--on-surface-variant)' }}>S. aureus Incubation</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--on-surface)' }}>2.0 – 6.0 hrs</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--primary)', marginTop: '4px' }}>&Delta;t = 3.5h &rarr; Peak Likelihood</div>
              </div>
              <div className="luminous-card" style={{ padding: '14px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--on-surface-variant)' }}>B. cereus (Emetic)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--on-surface)' }}>1.0 – 5.0 hrs</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>Rice / Starch vehicle</div>
              </div>
              <div className="luminous-card" style={{ padding: '14px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--on-surface-variant)' }}>Salmonella spp.</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--on-surface)' }}>12.0 – 36.0 hrs</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>Delayed febrile presentation</div>
              </div>
              <div className="luminous-card" style={{ padding: '14px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--on-surface-variant)' }}>Norovirus</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--on-surface)' }}>24.0 – 48.0 hrs</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>Secondary aerosol transmission</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DPDP ACT 2023 COMPLIANCE SCORECARD */}
        {activeProofTab === 'dpdpCompliance' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            
            <div style={{ border: '1.5px solid #D9FF5F', background: '#FAFDF0', padding: '16px', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--primary)' }} />
                <strong style={{ fontSize: '0.85rem', color: 'var(--on-surface)' }}>k-Anonymity (k &ge; 5)</strong>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)' }}>
                Micro-spatial GIS maps and telemetry charts will not display clusters smaller than 5 individuals, preventing individual deanonymization.
              </p>
            </div>

            <div style={{ border: '1.5px solid #D9FF5F', background: '#FAFDF0', padding: '16px', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--primary)' }} />
                <strong style={{ fontSize: '0.85rem', color: 'var(--on-surface)' }}>Zero Raw PII in DB</strong>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)' }}>
                Roll numbers and names are cryptographically blinded with salted SHA-256 tokens (<code>USR-CHK-...</code>) before hitting database storage.
              </p>
            </div>

            <div style={{ border: '1.5px solid #D9FF5F', background: '#FAFDF0', padding: '16px', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--primary)' }} />
                <strong style={{ fontSize: '0.85rem', color: 'var(--on-surface)' }}>Section 8(7) Consent Shredder</strong>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)' }}>
                Students retain the statutory right to withdraw consent with 1-click, permanently erasing all associated raw records.
              </p>
            </div>

            <div style={{ border: '1.5px solid #D9FF5F', background: '#FAFDF0', padding: '16px', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--primary)' }} />
                <strong style={{ fontSize: '0.85rem', color: 'var(--on-surface)' }}>Cryptographic Audit Trail</strong>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)' }}>
                Every containment action, telemetry query, and consent revocation is immutably logged in a hash-chained audit ledger.
              </p>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
