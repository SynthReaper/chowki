/**
 * @component PrivacyHub
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description DPDP Act 2023 Student Data Principal Privacy Hub, Audit Ledger & Erasure Controller
 * @lastModified 2026-08-22
 */

import React, { useState, useEffect } from 'react';
import { Lock, Shield, Trash2, Key, History, CheckCircle, AlertTriangle } from 'lucide-react';
import { getConsentStatus, revokeConsent, getAuditLedger } from '../api/client';

export default function PrivacyHub() {
  const [tokenInput, setTokenInput] = useState('22CS0144');
  const [activeToken, setActiveToken] = useState('');
  const [consentData, setConsentData] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [revokeMsg, setRevokeMsg] = useState('');

  const loadAuditLogs = async () => {
    try {
      const logs = await getAuditLedger();
      setAuditLogs(logs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const handleInspectConsent = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setRevokeMsg('');
    try {
      const data = await getConsentStatus(tokenInput);
      setConsentData(data);
      setActiveToken(tokenInput);
    } catch (err) {
      alert(`Error fetching consent: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeConsent = async () => {
    if (!activeToken) return;
    if (!window.confirm('Revoke DPDP consent and initiate immediate hard purge of all associated check-in telemetry?')) return;
    
    try {
      const res = await revokeConsent(activeToken);
      setRevokeMsg(`✅ ${res.message} (${res.records_purged} check-in records deleted).`);
      handleInspectConsent();
      loadAuditLogs();
    } catch (err) {
      alert(`Revocation error: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
      
      {/* Left Card: DPDP Compliance & Consent Controls */}
      <div className="luminous-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Lock size={18} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--on-surface)' }}>
            DPDP Act 2023 Privacy & Erasure Hub
          </h2>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', marginBottom: '18px' }}>
          Inspect your cryptographically salted weekly-rotating token, check statutory audit logs, or exercise your Right to Erasure (Section 8(7)).
        </p>

        <form onSubmit={handleInspectConsent} style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '4px' }}>
            Enter Pseudonym Token / Student Roll:
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              style={{ flex: 1, padding: '9px 14px', background: 'var(--surface-container-low)', border: '1px solid var(--surface-container)', borderRadius: 'var(--radius-md)', color: 'var(--on-surface)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}
              required
            />
            <button type="submit" className="btn-ghost-pill" style={{ padding: '9px 16px' }}>
              Inspect
            </button>
          </div>
        </form>

        {consentData && (
          <div style={{ background: 'var(--surface-container-low)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', fontWeight: '600' }}>Consent State:</span>
              <span className={`pill-badge ${consentData.consent_given ? 'badge-lime' : 'badge-crimson'}`}>
                {consentData.consent_given ? 'Opt-In Active' : 'Revoked / Purged'}
              </span>
            </div>

            <div style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)', lineHeight: 1.7 }}>
              <div>🔑 Pseudonym Token: <strong className="font-mono" style={{ color: 'var(--on-surface)' }}>{consentData.token.substring(0, 16)}...</strong></div>
              <div>📅 Auto-Purge Schedule: <strong style={{ color: 'var(--on-surface)' }}>30 Days Rolling</strong></div>
              <div>🛡️ k-Anonymity Floor: <strong style={{ color: 'var(--primary)' }}>Enforced (k ≥ 5 per floor)</strong></div>
            </div>

            {consentData.consent_given && (
              <button
                onClick={handleRevokeConsent}
                className="btn-crimson"
                style={{ width: '100%', marginTop: '16px', fontSize: '0.78rem', justifyContent: 'center' }}
              >
                <Trash2 size={14} />
                Revoke Consent & Trigger 72h Data Purge (Sec 8(7))
              </button>
            )}
          </div>
        )}

        {revokeMsg && (
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--primary-container)', color: 'var(--on-primary-container)', fontSize: '0.8rem', fontWeight: '600' }}>
            {revokeMsg}
          </div>
        )}
      </div>

      {/* Right Card: Immutable Statutory Audit Ledger */}
      <div className="luminous-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} style={{ color: 'var(--tertiary)' }} />
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--on-surface)' }}>
              Immutable Compliance Audit Ledger
            </h2>
          </div>
          <span className="pill-badge badge-lavender">
            Append-Only
          </span>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', marginBottom: '14px' }}>
          Real-time statutory transparency log tracking all data processing, sensor anomalies, and purge events.
        </p>

        <div style={{ maxHeight: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {auditLogs.slice(0, 10).map((log) => (
            <div
              key={log.id}
              style={{
                background: 'var(--surface-container-low)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                fontSize: '0.76rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="font-mono" style={{ fontWeight: '700', color: 'var(--on-surface)' }}>
                  {log.event_type}
                </span>
                <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--on-surface-variant)' }}>
                  {new Date(log.created_at).toLocaleTimeString('en-IN')}
                </span>
              </div>
              <div style={{ color: 'var(--on-surface-variant)' }}>
                Role: <strong style={{ color: 'var(--on-surface)' }}>{log.actor_role}</strong> • Zone: {log.zone_affected || 'Global'}
              </div>
              <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--on-surface-variant)', marginTop: '3px' }}>
                Legal Basis: {log.legal_basis}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
