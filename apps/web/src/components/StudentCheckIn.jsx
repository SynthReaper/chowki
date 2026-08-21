/**
 * @component StudentCheckIn
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description 15-second zero-friction student health pulse dispatcher with bilingual localization
 * @lastModified 2026-08-22
 */

import React, { useState } from 'react';
import { Activity, Check, HeartPulse, Send, ShieldAlert, Sparkles, Globe } from 'lucide-react';
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

  const t = {
    en: {
      title: '15-Second Student Health Pulse',
      subtitle: 'Zero-friction telemetry to detect water contamination and mess food safety hazards before outbreaks spread.',
      studentIdLabel: 'Student Roll / Device ID (Hashed at Edge):',
      zoneLabel: 'Hostel Block & Floor:',
      symptomsLabel: 'Current Physical Symptoms (Select all that apply):',
      onsetLabel: 'Incubation Onset Delta After Last Meal:',
      mealLabel: 'Last Meal Location:',
      submitBtn: 'Transmit Health Pulse (<15s)',
      sympNames: {
        nausea: '🤢 Nausea / Queasiness',
        vomiting: '🤮 Vomiting',
        cramps: '⚡ Severe Stomach Cramps',
        diarrhea: '💧 Watery Diarrhea',
        fever: '🌡️ Mild / High Fever',
        fine: '✨ Feeling Completely Fine'
      }
    },
    hi: {
      title: '१५-सेकंड छात्र स्वास्थ्य चेक-इन',
      subtitle: 'हॉस्टल के पानी और मेस के खाने की सुरक्षा के लिए अज्ञात डेटा।',
      studentIdLabel: 'रोल नंबर / डिवाइस आईडी (अज्ञात):',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div className="luminous-card">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--on-primary-container)'
            }}>
              <HeartPulse size={20} />
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--on-surface)' }}>
              {t.title}
            </h2>
          </div>
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="btn-ghost-pill"
            style={{ padding: '6px 14px', fontSize: '0.76rem' }}
          >
            <Globe size={14} />
            {lang === 'en' ? 'हिंदी में बदलें' : 'English'}
          </button>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', marginBottom: '20px' }}>
          {t.subtitle}
        </p>

        <form onSubmit={handleSubmit}>
          
          {/* Identity Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '6px' }}>
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
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '6px' }}>
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
                <option value="Hostel_C_Fl_3">Hostel C — 3rd Floor</option>
                <option value="Hostel_A_Fl_1">Hostel A — 1st Floor</option>
                <option value="Hostel_B_Fl_2">Hostel B — 2nd Floor</option>
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
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '6px' }}>
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
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '6px' }}>
                {t.mealLabel}
              </label>
              <select
                value={mealLocation}
                onChange={(e) => setMealLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  background: 'var(--surface-container-low)',
                  border: '1px solid var(--surface-container)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--on-surface)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="Mess_2_Girls">Mess 2 (Dining Hall 2)</option>
                <option value="Mess_1_Main">Mess 1 (Main Hall)</option>
                <option value="canteen">Night Canteen</option>
                <option value="off_campus">Off-Campus Zomato / Swiggy</option>
              </select>
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
            {loading ? 'Transmitting Cryptographic Telemetry...' : t.submitBtn}
          </button>
        </form>

        {/* Real-time Response & Floor Status Advisory */}
        {responseResult && (
          <div style={{
            marginTop: '22px',
            padding: '18px',
            borderRadius: 'var(--radius-lg)',
            background: responseResult.status_color === 'red' ? 'var(--error-container)' : 'var(--primary-container)',
            border: `1.5px solid ${responseResult.status_color === 'red' ? 'var(--error)' : 'var(--primary)'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={20} style={{ color: responseResult.status_color === 'red' ? 'var(--on-error-container)' : 'var(--on-primary-container)' }} />
                <strong style={{ fontSize: '0.95rem', color: responseResult.status_color === 'red' ? 'var(--on-error-container)' : 'var(--on-primary-container)' }}>
                  Floor Status: {responseResult.floor_status.toUpperCase()}
                </strong>
              </div>
              <span className="font-mono" style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.6)' }}>
                Token: {responseResult.pseudonym_token.substring(0, 12)}...
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: responseResult.status_color === 'red' ? 'var(--on-error-container)' : 'var(--on-primary-container)', lineHeight: 1.5, fontWeight: '500' }}>
              {responseResult.advisory_message}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
