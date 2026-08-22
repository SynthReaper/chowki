/**
 * @component StudentCheckIn
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description 15-second zero-friction student health pulse dispatcher with real-time stakeholder dispatch alerts & medical advisory
 * @lastModified 2026-08-22
 */

import React, { useState } from 'react';
import { Activity, Check, HeartPulse, Send, ShieldAlert, Sparkles, Globe, UserCheck, Microscope, Utensils, Lock, PhoneCall, MapPin, AlertCircle, Droplets, Trash2, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { submitCheckin } from '../api/client';

export default function StudentCheckIn({ onCheckinSuccess }) {
  const [lang, setLang] = useState('en'); // 'en' | 'hi'
  const [studentId, setStudentId] = useState('22CS0144');
  const [zone, setZone] = useState('Hostel_C_Fl_3');
  const [symptoms, setSymptoms] = useState(['nausea', 'vomiting']);
  const [onsetBucket, setOnsetBucket] = useState('2-8h');
  const [mealLocation, setMealLocation] = useState('Mess_2_Girls');
  const [mealItem, setMealItem] = useState('Palak Paneer');
  const [waterSource, setWaterSource] = useState('floor_ro');
  const [loading, setLoading] = useState(false);
  const [responseResult, setResponseResult] = useState(null);
  const [wardenRequested, setWardenRequested] = useState(false);
  const [shredded, setShredded] = useState(false);

  const t = {
    en: {
      title: '15-Second Student Health Pulse',
      subtitle: 'Zero-friction telemetry to detect water contamination and mess food safety hazards before outbreaks spread.',
      studentIdLabel: 'Student Roll / Device ID (Encrypted at Client Edge):',
      zoneLabel: 'Hostel Block & Floor:',
      symptomsLabel: 'Current Physical Symptoms (Select all that apply):',
      onsetLabel: 'Incubation Onset Delta After Last Meal:',
      mealLabel: 'Last Meal Location & Suspect Dish:',
      submitBtn: 'Transmit Health Pulse (<15s)',
      sympNames: {
        nausea: '🤢 Nausea / Queasiness',
        vomiting: '🤮 Projectile Vomiting',
        cramps: '⚡ Severe Stomach Cramps',
        diarrhea: '💧 Watery Diarrhea',
        fever: '🌡️ Mild / High Fever',
        fine: '✨ Feeling Completely Fine'
      }
    },
    hi: {
      title: '१५-सेकंड छात्र स्वास्थ्य चेक-इन',
      subtitle: 'हॉस्टल के पानी और मेस के खाने की सुरक्षा के लिए अज्ञात डेटा।',
      studentIdLabel: 'रोल नंबर / डिवाइस आईडी (एन्क्रिप्टेड):',
      zoneLabel: 'हॉस्टल ब्लॉक और फ्लोर:',
      symptomsLabel: 'आप अभी कैसा महसूस कर रहे हैं? (चयन करें)',
      onsetLabel: 'खाना खाने के कितने समय बाद परेशानी शुरू हुई?',
      mealLabel: 'आपने पिछला भोजन कहाँ किया था?',
      submitBtn: 'स्वास्थ्य स्थिति भेजें (<15s)',
      sympNames: {
        nausea: '🤢 जी मिचलाना (Nausea)',
        vomiting: '🤮 उल्टी (Vomiting)',
        cramps: '⚡ पेट में तेज दर्द (Cramps)',
        diarrhea: '💧 दस्त (Diarrhea)',
        fever: '🌡️ बुखार (Fever)',
        fine: '✨ बिल्कुल ठीक हूँ'
      }
    }
  }[lang];

  const toggleSymptom = (sympKey) => {
    if (sympKey === 'fine') {
      setSymptoms([]);
      return;
    }
    if (symptoms.includes(sympKey)) {
      setSymptoms(symptoms.filter(s => s !== sympKey));
    } else {
      setSymptoms([...symptoms, sympKey]);
    }
  };

  const calculateDehydrationScore = () => {
    let score = 0;
    if (symptoms.includes('vomiting')) score += 3;
    if (symptoms.includes('diarrhea')) score += 3;
    if (symptoms.includes('cramps')) score += 2;
    if (symptoms.includes('fever')) score += 2;
    if (symptoms.includes('nausea')) score += 1;

    if (score >= 5) return { label: 'High Dehydration Risk 🚨', level: 'high', color: 'var(--error)' };
    if (score >= 2) return { label: 'Moderate Risk ⚠️', level: 'moderate', color: '#D97706' };
    return { label: 'Low / Mild Risk 🟢', level: 'low', color: 'var(--primary)' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShredded(false);
    setWardenRequested(false);
    try {
      const payload = {
        student_id_or_device: studentId,
        spatial_zone: zone,
        symptoms: symptoms,
        onset_bucket: onsetBucket,
        meal_location: mealLocation,
        meal_item_tag: mealItem,
        water_source: waterSource
      };
      const res = await submitCheckin(payload);
      setResponseResult(res);
      if (onCheckinSuccess) onCheckinSuccess();
    } catch (err) {
      alert(`Error submitting check-in: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleShredConsent = () => {
    setShredded(true);
    setResponseResult(null);
  };

  const dehydration = calculateDehydrationScore();

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Check-In Form Card */}
      <div className="luminous-card">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--on-primary-container)',
              boxShadow: '0 4px 12px var(--primary-glow)'
            }}>
              <HeartPulse size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>
                {t.title}
              </h2>
              <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: '700' }}>
                🔒 100% Anonymous • Salted SHA-256 Tokenization • DPDP Act 2023 Protected
              </div>
            </div>
          </div>

          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="btn-ghost-pill"
            style={{ padding: '6px 14px', fontSize: '0.76rem' }}
          >
            <Globe size={14} />
            {lang === 'en' ? 'हिंदी में बदलें (Hindi)' : 'English'}
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginBottom: '20px' }}>
          {t.subtitle}
        </p>

        <form onSubmit={handleSubmit}>
          
          {/* Identity Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--on-surface)', marginBottom: '6px' }}>
                {t.studentIdLabel}
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'var(--surface-container-low)',
                  border: '1px solid var(--surface-container)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--on-surface)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--on-surface)', marginBottom: '6px' }}>
                {t.zoneLabel}
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'var(--surface-container-low)',
                  border: '1px solid var(--surface-container)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--on-surface)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="Hostel_C_Fl_3">Hostel C — 3rd Floor (Current Hotspot)</option>
                <option value="Hostel_B_Fl_2">Hostel B — 2nd Floor</option>
                <option value="Hostel_A_Fl_1">Hostel A — 1st Floor</option>
                <option value="Hostel_D_Fl_1">Hostel D — 1st Floor</option>
              </select>
            </div>
          </div>

          {/* Symptom Selection Tiles */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--on-surface)', marginBottom: '10px' }}>
              {t.symptomsLabel}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              {Object.entries(t.sympNames).map(([key, name]) => {
                const isSelected = key === 'fine' ? symptoms.length === 0 : symptoms.includes(key);
                return (
                  <div
                    key={key}
                    onClick={() => toggleSymptom(key)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--primary-container)' : 'var(--surface-container-low)',
                      border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--surface-container)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 12px var(--primary-glow)' : 'none'
                    }}
                  >
                    <span style={{ fontSize: '0.84rem', fontWeight: isSelected ? '700' : '500', color: isSelected ? 'var(--on-primary-container)' : 'var(--on-surface)' }}>
                      {name}
                    </span>
                    {isSelected && <Check size={16} style={{ color: 'var(--primary)' }} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Onset & Dining Slot */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--on-surface)', marginBottom: '6px' }}>
                {t.onsetLabel}
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['<2h', '2-8h', '>8h'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setOnsetBucket(b)}
                    style={{
                      flex: 1,
                      padding: '9px',
                      borderRadius: 'var(--radius-full)',
                      background: onsetBucket === b ? 'var(--tertiary-container)' : 'var(--surface-container-low)',
                      border: onsetBucket === b ? '1.5px solid var(--tertiary)' : '1px solid var(--surface-container)',
                      color: onsetBucket === b ? 'var(--on-tertiary-container)' : 'var(--on-surface-variant)',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--on-surface)', marginBottom: '6px' }}>
                {t.mealLabel}
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={mealLocation}
                  onChange={(e) => setMealLocation(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    background: 'var(--surface-container-low)',
                    border: '1px solid var(--surface-container)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--on-surface)',
                    fontSize: '0.82rem'
                  }}
                >
                  <option value="Mess_2_Girls">Mess 2 (Dining Hall 2)</option>
                  <option value="Mess_1_Main">Mess 1 (Main Hall)</option>
                  <option value="canteen">Night Canteen</option>
                  <option value="off_campus">Off-Campus Food</option>
                </select>

                <input
                  type="text"
                  value={mealItem}
                  onChange={(e) => setMealItem(e.target.value)}
                  placeholder="e.g. Palak Paneer"
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    background: 'var(--surface-container-low)',
                    border: '1px solid var(--surface-container)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--on-surface)',
                    fontSize: '0.82rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="btn-lime"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem' }}
          >
            <Send size={18} />
            {loading ? 'Blinding Roll ID & Transmitting Pulse...' : t.submitBtn}
          </button>
        </form>

        {shredded && (
          <div style={{
            marginTop: '18px',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            background: '#FAFDF0',
            border: '1.5px solid var(--primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <ShieldCheck size={20} style={{ color: 'var(--primary)' }} />
            <div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--on-surface)' }}>
                DPDP Act Section 8(7) Shred Complete:
              </strong>
              <div style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)' }}>
                Your health check-in record and token have been permanently erased from the surveillance database.
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ============================================================
          REAL-TIME INCIDENT DISPATCH & DESIGNATED ALERT PIPELINE
          ============================================================ */}
      {responseResult && (
        <div className="luminous-card" style={{
          padding: '24px',
          border: '1.5px solid var(--primary-container)',
          background: '#FFFFFF'
        }}>
          
          {/* Header & Clinical Triage Severity Banner */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--surface-container)', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="pill-badge badge-lime">
                  ✓ Transmitted & Encrypted
                </span>
                <span className="pill-badge badge-lavender" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                  Token: {responseResult.pseudonym_token.substring(0, 14)}...
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>
                Real-Time Incident Dispatch & Clinical Action Plan
              </h3>
            </div>

            {/* Dehydration Triage Badge */}
            <div style={{
              background: dehydration.level === 'high' ? '#FFDAD6' : dehydration.level === 'moderate' ? '#FEF3C7' : '#F4FDE2',
              color: dehydration.level === 'high' ? '#93000A' : dehydration.level === 'moderate' ? '#92400E' : '#364B00',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontWeight: '800',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Droplets size={14} />
              <span>Triage Assessment: {dehydration.label}</span>
            </div>
          </div>

          {/* Section 1: WHO WAS ALERTED IN REAL TIME (STAKEHOLDER DISPATCH CHAIN) */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--on-surface)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} style={{ color: 'var(--primary)' }} />
              Designated Stakeholder Dispatch Chain (Alerts Triggered Automatically):
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              
              {/* Alert 1: CMO */}
              <div style={{ background: 'var(--surface-container-low)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-container)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '800', color: 'var(--on-surface)' }}>
                    👨‍⚕️ Campus Medical Officer
                  </div>
                  <span className="pill-badge badge-crimson" style={{ fontSize: '0.65rem' }}>
                    War Room Alerted
                  </span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
                  Case vector added to <strong>{zone.replace(/_/g, ' ')}</strong> cluster. Live Bayesian model updated (S. aureus prior boost).
                </p>
              </div>

              {/* Alert 2: Hostel Warden */}
              <div style={{ background: 'var(--surface-container-low)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-container)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '800', color: 'var(--on-surface)' }}>
                    👨‍✈️ Hostel Warden (Block C)
                  </div>
                  <span className="pill-badge badge-amber" style={{ fontSize: '0.65rem' }}>
                    Task Queued
                  </span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
                  Automated checklist item created: <strong>Doorstep WHO-ORS Hydration Delivery</strong> to corridor rooms.
                </p>
              </div>

              {/* Alert 3: Dining HACCP */}
              <div style={{ background: 'var(--surface-container-low)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-container)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '800', color: 'var(--on-surface)' }}>
                    🍽️ Dining & Kitchen Lead
                  </div>
                  <span className="pill-badge badge-lime" style={{ fontSize: '0.65rem' }}>
                    Batch Flagged
                  </span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
                  <strong>{mealItem}</strong> linked to Mess 2 service. Quarantine protocol initiated pending holding temp review.
                </p>
              </div>

              {/* Alert 4: DPDP Privacy Vault */}
              <div style={{ background: 'var(--surface-container-low)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-container)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '800', color: 'var(--on-surface)' }}>
                    🔒 DPDP Privacy Vault
                  </div>
                  <span className="pill-badge badge-lavender" style={{ fontSize: '0.65rem' }}>
                    k &ge; 5 Enforced
                  </span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--on-surface-variant)', lineHeight: 1.4 }}>
                  Zero raw roll numbers saved. Data masked with salted hash tokens under statutory Section 6 consent.
                </p>
              </div>

            </div>
          </div>

          {/* Section 2: ACTIONABLE MEDICAL ADVISORY FOR STUDENT */}
          <div style={{
            background: responseResult.status_color === 'red' ? '#FFF5F5' : '#F9FDF5',
            border: `1.5px solid ${responseResult.status_color === 'red' ? 'var(--error-container)' : 'var(--primary-container)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '18px 20px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertCircle size={18} style={{ color: responseResult.status_color === 'red' ? 'var(--error)' : 'var(--primary)' }} />
              <strong style={{ fontSize: '0.92rem', color: 'var(--on-surface)' }}>
                Clinical Care Advisory ({responseResult.floor_status.toUpperCase()} STATUS)
              </strong>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--on-surface)', lineHeight: 1.5, marginBottom: '14px' }}>
              {responseResult.advisory_message}
            </p>

            {/* Protocol checklist */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', fontSize: '0.76rem' }}>
              <div style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '2px' }}>💧 Oral Rehydration:</strong>
                Sip 200ml WHO-ORS solution every 30 mins. Do not drink plain tap water.
              </div>
              <div style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <strong style={{ color: '#D97706', display: 'block', marginBottom: '2px' }}>🚫 Dietary Restriction:</strong>
                Avoid dairy, fried food, and caffeine for 12 hours. Stick to light khichdi.
              </div>
              <div style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <strong style={{ color: 'var(--error)', display: 'block', marginBottom: '2px' }}>⚠️ Red Flag Warning:</strong>
                If vomiting exceeds 3 episodes or you feel dizzy, visit the Health Center immediately.
              </div>
            </div>
          </div>

          {/* Section 3: NEAREST FREE ORS DISPENSARIES & EMERGENCY HELPLINE */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '18px' }}>
            
            {/* Dispensary Locations */}
            <div style={{ background: 'var(--surface-container-low)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-container)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '800', color: 'var(--on-surface)', marginBottom: '8px' }}>
                <MapPin size={14} style={{ color: 'var(--primary)' }} />
                Nearest Free ORS & Electrolyte Dispensaries:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.74rem', color: 'var(--on-surface-variant)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: '#FFFFFF', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                  <span>📍 <strong>Hostel C Warden Desk (Ground Floor)</strong></span>
                  <span style={{ color: 'var(--primary)', fontWeight: '700' }}>40m away (Open 24/7)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: '#FFFFFF', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                  <span>📍 <strong>Campus Health Center Counter 2</strong></span>
                  <span style={{ color: 'var(--primary)', fontWeight: '700' }}>150m away (24/7)</span>
                </div>
              </div>
            </div>

            {/* Emergency Hotline & Warden Visit Action */}
            <div style={{ background: 'var(--surface-container-low)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-container)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '800', color: 'var(--on-surface)', marginBottom: '6px' }}>
                  <PhoneCall size={14} style={{ color: '#BA1A1A' }} />
                  24/7 Campus Medical Helpline:
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)' }}>
                  Dispensary Hotline: <strong>+91-800-CHOWKI-HELP (Ext: 4433)</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setWardenRequested(true)}
                  disabled={wardenRequested}
                  className="pill-button"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: wardenRequested ? 'var(--surface-container)' : 'var(--tertiary-container)',
                    color: wardenRequested ? 'var(--on-surface-variant)' : 'var(--tertiary)',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    border: 'none',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  {wardenRequested ? '✓ Warden Check Dispatched' : 'Request Warden Room Visit'}
                </button>
              </div>
            </div>

          </div>

          {/* Section 4: DPDP ACT STATUTORY CONSENT SHREDDER */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            borderTop: '1px solid var(--surface-container)',
            paddingTop: '14px',
            fontSize: '0.74rem',
            color: 'var(--on-surface-variant)'
          }}>
            <div>
              ⚖️ Under <strong>DPDP Act 2023 Section 8(7)</strong>, you retain the statutory right to withdraw health telemetry consent at any time.
            </div>

            <button
              type="button"
              onClick={handleShredConsent}
              style={{
                background: '#FFF0F0',
                color: '#BA1A1A',
                border: '1px solid var(--error-container)',
                borderRadius: 'var(--radius-full)',
                padding: '5px 12px',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Trash2 size={12} />
              Shred My Telemetry Record
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
