/**
 * @component ActionMatrix
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description CMO Tactical Containment Action Matrix with Luminous Health styling
 * @lastModified 2026-08-22
 */

import React, { useState } from 'react';
import { ShieldAlert, Droplets, UtensilsCrossed, Send, CheckCircle, Clock } from 'lucide-react';
import { suspendMenuItem } from '../api/client';

export default function ActionMatrix({ primaryRiskZone, highestAlertLevel, onActionExecuted }) {
  const [executedActions, setExecutedActions] = useState({});
  const [statusMessage, setStatusMessage] = useState('');

  const handleAction = async (key, title, apiCall) => {
    try {
      if (apiCall) await apiCall();
      setExecutedActions(prev => ({ ...prev, [key]: new Date().toLocaleTimeString('en-IN') }));
      setStatusMessage(`✅ Dispatched: ${title}`);
      if (onActionExecuted) onActionExecuted();
    } catch (err) {
      console.error(err);
      setStatusMessage(`❌ Dispatch error: ${err.message}`);
    }
  };

  const isAlert = highestAlertLevel >= 2;

  return (
    <div className="luminous-card">
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={18} style={{ color: isAlert ? 'var(--error)' : 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--on-surface)' }}>
            Containment Action Matrix
          </h2>
        </div>
        <span style={{ fontSize: '0.74rem', color: 'var(--on-surface-variant)', fontWeight: '600' }}>
          Target: {primaryRiskZone || 'Campus Wide'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        
        {/* Action 1: RO Valve Lock */}
        <div style={{ background: 'var(--surface-container-low)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Droplets size={16} style={{ color: 'var(--tertiary)' }} />
            <strong style={{ fontSize: '0.86rem', color: 'var(--on-surface)' }}>RO Sump Isolation</strong>
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)', marginBottom: '14px', lineHeight: 1.4 }}>
            Lock Floor 3 intake valve. Force bypass to backup chlorinated tanker supply.
          </p>
          <button
            onClick={() => handleAction('lock_ro', 'RO Valve Isolation Dispatched')}
            className={executedActions.lock_ro ? 'btn-ghost-pill' : 'btn-crimson'}
            style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'center' }}
          >
            {executedActions.lock_ro ? <CheckCircle size={14} style={{ color: 'var(--primary)' }} /> : null}
            {executedActions.lock_ro ? `Locked at ${executedActions.lock_ro}` : 'Lock RO Valve'}
          </button>
        </div>

        {/* Action 2: Suspend High Risk Dish */}
        <div style={{ background: 'var(--surface-container-low)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <UtensilsCrossed size={16} style={{ color: 'var(--amber-accent)' }} />
            <strong style={{ fontSize: '0.86rem', color: 'var(--on-surface)' }}>Mess Quarantine</strong>
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)', marginBottom: '14px', lineHeight: 1.4 }}>
            Halt Palak Paneer dinner service. Discard remaining stock and sterilize cauldrons.
          </p>
          <button
            onClick={() => handleAction('suspend_dish', 'Palak Paneer Suspended in Mess 2')}
            className={executedActions.suspend_dish ? 'btn-ghost-pill' : 'btn-crimson'}
            style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'center' }}
          >
            {executedActions.suspend_dish ? <CheckCircle size={14} style={{ color: 'var(--primary)' }} /> : null}
            {executedActions.suspend_dish ? `Suspended at ${executedActions.suspend_dish}` : 'Suspend Suspect Dish'}
          </button>
        </div>

        {/* Action 3: Targeted WhatsApp Advisory */}
        <div style={{ background: 'var(--surface-container-low)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Send size={16} style={{ color: 'var(--primary)' }} />
            <strong style={{ fontSize: '0.86rem', color: 'var(--on-surface)' }}>Targeted Broadcast</strong>
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)', marginBottom: '14px', lineHeight: 1.4 }}>
            Send WhatsApp advisory to Block C residents: "Drink bottled water, collect ORS at desk."
          </p>
          <button
            onClick={() => handleAction('broadcast', 'WhatsApp Broadcast Sent to Block C')}
            className={executedActions.broadcast ? 'btn-ghost-pill' : 'btn-lime'}
            style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'center' }}
          >
            {executedActions.broadcast ? <CheckCircle size={14} style={{ color: 'var(--primary)' }} /> : null}
            {executedActions.broadcast ? `Sent at ${executedActions.broadcast}` : 'Dispatch Advisory'}
          </button>
        </div>

      </div>

      {statusMessage && (
        <div style={{ marginTop: '14px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle size={15} />
          <span>{statusMessage}</span>
        </div>
      )}

    </div>
  );
}
