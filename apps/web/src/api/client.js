/**
 * Project CHOWKI — Campus Outbreak Surveillance System
 * Made by Synthreaper | github.com/synthreaper/chowki
 * File: apps/web/src/api/client.js | Last Modified: 2026-08-22
 */

const API_BASE = '/api/v1';

export async function fetchLiveRadar() {
  const res = await fetch(`${API_BASE}/radar/live`);
  if (!res.ok) throw new Error(`Radar fetch failed: ${res.statusText}`);
  return res.json();
}

export async function submitCheckin(payload) {
  const res = await fetch(`${API_BASE}/checkin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Check-in failed: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchMenu() {
  const res = await fetch(`${API_BASE}/menu`);
  if (!res.ok) throw new Error(`Menu fetch failed: ${res.statusText}`);
  return res.json();
}

export async function createMenuItem(payload) {
  const res = await fetch(`${API_BASE}/menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Create dish failed: ${res.statusText}`);
  return res.json();
}

export async function suspendMenuItem(itemId) {
  const res = await fetch(`${API_BASE}/menu/${itemId}/suspend`, {
    method: 'PATCH'
  });
  if (!res.ok) throw new Error(`Dish suspension failed: ${res.statusText}`);
  return res.json();
}

export async function fetchIoTTelemetry() {
  const res = await fetch(`${API_BASE}/telemetry/iot`);
  if (!res.ok) throw new Error(`IoT fetch failed: ${res.statusText}`);
  return res.json();
}

export async function fetchPharmacyTelemetry() {
  const res = await fetch(`${API_BASE}/telemetry/pharmacy`);
  if (!res.ok) throw new Error(`Pharmacy fetch failed: ${res.statusText}`);
  return res.json();
}

export async function fetchWardenTasks(zone = 'Hostel_C_Fl_3') {
  const res = await fetch(`${API_BASE}/warden/tasks/${zone}`);
  if (!res.ok) throw new Error(`Warden tasks fetch failed: ${res.statusText}`);
  return res.json();
}

export async function updateWardenTask(taskId, isCompleted, notes = '') {
  const res = await fetch(`${API_BASE}/warden/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      is_completed: isCompleted,
      completed_by: 'Hostel Warden',
      verification_notes: notes
    })
  });
  if (!res.ok) throw new Error(`Task update failed: ${res.statusText}`);
  return res.json();
}

export async function submitWardenFieldLog(payload) {
  const res = await fetch(`${API_BASE}/warden/field-log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Field log submission failed: ${res.statusText}`);
  return res.json();
}

export async function getConsentStatus(token) {
  const res = await fetch(`${API_BASE}/consent/${token}`);
  if (!res.ok) throw new Error(`Consent status failed: ${res.statusText}`);
  return res.json();
}

export async function revokeConsent(token) {
  const res = await fetch(`${API_BASE}/consent/${token}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Consent revocation failed: ${res.statusText}`);
  return res.json();
}

export async function getAuditLedger() {
  const res = await fetch(`${API_BASE}/consent/audit/ledger`);
  if (!res.ok) throw new Error(`Audit ledger fetch failed: ${res.statusText}`);
  return res.json();
}

export async function triggerOutbreakScenario() {
  const res = await fetch(`${API_BASE}/simulation/outbreak`, { method: 'POST' });
  if (!res.ok) throw new Error(`Outbreak trigger failed: ${res.statusText}`);
  return res.json();
}

export async function triggerCoincidentalScenario() {
  const res = await fetch(`${API_BASE}/simulation/coincidental`, { method: 'POST' });
  if (!res.ok) throw new Error(`Coincidental trigger failed: ${res.statusText}`);
  return res.json();
}

export async function resetScenario() {
  const res = await fetch(`${API_BASE}/simulation/reset`, { method: 'POST' });
  if (!res.ok) throw new Error(`Reset failed: ${res.statusText}`);
  return res.json();
}
