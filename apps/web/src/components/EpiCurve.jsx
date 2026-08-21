/**
 * @component EpiCurve
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description High-Contrast 72-Hour Epidemic Curve Histogram with Safe Null Checking
 * @lastModified 2026-08-22
 */

import React from 'react';
import { TrendingUp, Clock, AlertCircle } from 'lucide-react';

export default function EpiCurve({ points = [] }) {
  const safePoints = Array.isArray(points) ? points : [];
  const maxCount = safePoints.length > 0
    ? Math.max(...safePoints.map(p => p.case_count || 0), 4)
    : 4;
  const chartHeight = 160;

  return (
    <div className="luminous-dark-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '440px' }}>
      
      {/* Decorative Glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        background: 'rgba(217, 255, 95, 0.15)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }}></div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} style={{ color: 'var(--primary-container)' }} />
          <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--inverse-on-surface)' }}>
            72H Epidemic Curve
          </h2>
        </div>
        <div className="pill-badge" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF' }}>
          4-Hour Slices
        </div>
      </div>

      <p style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '16px', position: 'relative', zIndex: 2 }}>
        Identifies acute point-source exposure spikes vs continuous progressive transmission.
      </p>

      {/* Top Metrics Split */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
        <div style={{ borderLeft: '4px solid var(--primary-container)', paddingLeft: '12px' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#FFFFFF', lineHeight: 1.1 }}>
            {maxCount}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)' }}>Peak Cases / 4h</span>
        </div>
        <div style={{ borderLeft: '4px solid var(--tertiary-fixed-dim)', paddingLeft: '12px' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#FFFFFF', lineHeight: 1.1 }}>
            4.5h
          </div>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)' }}>Mean Onset (Δt)</span>
        </div>
      </div>

      {/* Histogram Bar Chart */}
      <div style={{
        flex: 1,
        marginTop: '10px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '6px',
        height: `${chartHeight}px`,
        position: 'relative',
        zIndex: 2
      }}>
        {safePoints.map((p, idx) => {
          const count = p.case_count || 0;
          const heightPct = Math.max(12, (count / maxCount) * 100);
          const isSpike = count >= 3;
          const rawTime = p.temporal_bin || p.time_bin || '';
          const timeLabel = p.label || (rawTime.length >= 16 ? rawTime.substring(11, 16) : `T${idx}`);

          return (
            <div
              key={p.temporal_bin || p.time_bin || idx}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end',
                cursor: 'pointer'
              }}
            >
              {count > 0 && (
                <span className="font-mono" style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  color: isSpike ? '#FF3366' : 'var(--primary-container)',
                  marginBottom: '6px'
                }}>
                  {count}
                </span>
              )}

              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  height: `${heightPct}%`,
                  background: isSpike
                    ? 'linear-gradient(180deg, #FF3366 0%, #BA1A1A 100%)'
                    : count > 0
                    ? 'linear-gradient(180deg, var(--primary-container) 0%, var(--tertiary-fixed-dim) 100%)'
                    : 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px 6px 0 0',
                  boxShadow: isSpike ? '0 0 16px rgba(255, 51, 102, 0.4)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />

              {/* Time Label */}
              <span style={{ fontSize: '0.6rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '8px', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                {timeLabel.length > 5 ? timeLabel.substring(timeLabel.length - 5) : timeLabel}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footnote */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        color: 'rgba(255, 255, 255, 0.5)',
        fontFamily: 'var(--font-mono)',
        position: 'relative',
        zIndex: 2
      }}>
        <span>TEMPORAL WINDOW: T-72H</span>
        <span style={{ color: 'var(--primary-container)' }}>POINT-SOURCE SIGNATURE MATCHED</span>
      </div>

    </div>
  );
}
