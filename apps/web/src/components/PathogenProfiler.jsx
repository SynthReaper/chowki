/**
 * @component PathogenProfiler
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description Luminous Health Pathogen Profiler & Bayesian Attribution Card
 * @lastModified 2026-08-22
 */

import React from 'react';
import { Microscope, ShieldCheck, Flame, Cpu, Droplets, Utensils } from 'lucide-react';

export default function PathogenProfiler({ clusters = [] }) {
  if (!clusters || clusters.length === 0) {
    return (
      <div className="luminous-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--primary-container)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px auto',
          color: 'var(--on-primary-container)'
        }}>
          <ShieldCheck size={28} />
        </div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--on-surface)', marginBottom: '4px' }}>
          No Active Infectious Clusters
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>
          STPSS Space-Time scan shows p ≥ 0.05. Campus epidemiological baseline is clear.
        </p>
      </div>
    );
  }

  return (
    <div className="luminous-card" style={{ borderColor: 'var(--error-container)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Microscope size={18} style={{ color: 'var(--error)' }} />
          <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--on-surface)' }}>
            Bayesian Pathogen Profiler
          </h2>
        </div>
        <span className="pill-badge badge-crimson">
          {clusters.length} Cluster Active
        </span>
      </div>

      {clusters.map((cluster) => {
        const isAlert = cluster.alert_level >= 2;
        const probs = cluster.pathogen_probabilities || {};

        return (
          <div
            key={cluster.cluster_id}
            style={{
              background: 'var(--surface-container-low)',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
              marginBottom: '12px'
            }}
          >
            
            {/* Top Cluster Metadata */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--on-surface)' }}>
                    {cluster.zone_name}
                  </span>
                  <span className="pill-badge badge-crimson">
                    Level 2 Alert
                  </span>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)', marginTop: '3px' }}>
                  Suspect Vehicle: <strong style={{ color: 'var(--on-surface)' }}>{cluster.likely_vehicle}</strong> • Detected at {cluster.detected_at}
                </div>
              </div>

              {/* STPSS Metrics Grid */}
              <div style={{ display: 'flex', gap: '12px', background: '#FFFFFF', padding: '8px 16px', borderRadius: 'var(--radius-md)', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                <div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--on-surface-variant)', fontWeight: '600' }}>CASES (O/E)</div>
                  <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--on-surface)' }}>
                    {cluster.case_count}/{cluster.expected_count}
                  </div>
                </div>
                <div style={{ width: '1px', background: 'var(--surface-container)' }}></div>
                <div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--on-surface-variant)', fontWeight: '600' }}>POISSON LLR</div>
                  <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--tertiary)' }}>
                    {cluster.llr}
                  </div>
                </div>
                <div style={{ width: '1px', background: 'var(--surface-container)' }}></div>
                <div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--on-surface-variant)', fontWeight: '600' }}>MONTE CARLO p</div>
                  <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--error)' }}>
                    {cluster.p_value}
                  </div>
                </div>
                <div style={{ width: '1px', background: 'var(--surface-container)' }}></div>
                <div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--on-surface-variant)', fontWeight: '600' }}>RELATIVE RISK</div>
                  <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>
                    {cluster.relative_risk}x
                  </div>
                </div>
              </div>
            </div>

            {/* Pathogen Probability Bars */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--on-surface-variant)', marginBottom: '8px', fontWeight: '600' }}>
                <span>Pathogen Fingerprint Posterior</span>
                <span style={{ color: 'var(--error)' }}>Outbreak Confidence: {Math.round(cluster.outbreak_probability * 100)}%</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {Object.entries(probs).map(([pId, prob]) => {
                  const pct = Math.round(prob * 100);
                  const isTop = cluster.top_pathogen === pId;
                  const label = pId.replace(/_/g, ' ').toUpperCase();

                  return (
                    <div
                      key={pId}
                      style={{
                        background: isTop ? '#FFFFFF' : 'var(--surface-container)',
                        border: isTop ? '1.5px solid var(--primary-container)' : '1px solid transparent',
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px 12px',
                        boxShadow: isTop ? '0 4px 12px rgba(217, 255, 95, 0.25)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '6px' }}>
                        <span style={{ fontWeight: isTop ? '700' : '600', color: isTop ? 'var(--on-surface)' : 'var(--on-surface-variant)' }}>
                          {label}
                        </span>
                        <span className="font-mono" style={{ fontWeight: '700', color: isTop ? 'var(--primary)' : 'var(--on-surface)' }}>
                          {pct}%
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'var(--surface-container-high)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: isTop ? 'var(--primary-container)' : 'var(--tertiary-fixed-dim)', borderRadius: 'var(--radius-full)' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Evidence Footnote */}
            <div style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              fontSize: '0.76rem',
              color: 'var(--on-surface-variant)',
              background: '#FFFFFF',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)'
            }}>
              <div>⏱️ Mean Incubation (Δt): <strong style={{ color: 'var(--on-surface)' }}>{cluster.incubation_delta_hours}h</strong></div>
              <div>🍽️ Mess Hazard Score (M_k): <strong style={{ color: 'var(--primary)' }}>{cluster.mess_hazard_score}</strong></div>
              <div>💧 Water Sensor Boost: <strong style={{ color: 'var(--tertiary)' }}>{cluster.environmental_boost}</strong></div>
            </div>

          </div>
        );
      })}

    </div>
  );
}
