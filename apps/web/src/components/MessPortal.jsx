/**
 * @component MessPortal
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description Mess Dining Hall manager portal for menu scheduling and food hazard mitigation
 * @lastModified 2026-08-22
 */

import React, { useState, useEffect } from 'react';
import { Utensils, AlertTriangle, Plus, ShieldBan, CheckCircle2 } from 'lucide-react';
import { fetchMenu, createMenuItem, suspendMenuItem } from '../api/client';

export default function MessPortal() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messId, setMessId] = useState('Mess_2_Girls');
  const [mealType, setMealType] = useState('dinner');
  const [itemName, setItemName] = useState('');
  const [servings, setServings] = useState(300);
  const [vendorType, setVendorType] = useState('in-house');

  const loadMenu = async () => {
    setLoading(true);
    try {
      const data = await fetchMenu();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!itemName) return;
    try {
      await createMenuItem({
        mess_id: messId,
        meal_type: mealType,
        item_name: itemName,
        vendor_type: vendorType,
        estimated_servings: parseInt(servings, 10)
      });
      setItemName('');
      loadMenu();
    } catch (err) {
      alert(`Failed to add dish: ${err.message}`);
    }
  };

  const handleSuspend = async (itemId) => {
    try {
      await suspendMenuItem(itemId);
      loadMenu();
    } catch (err) {
      alert(`Failed to suspend dish: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
      
      {/* Left Card: Active Menu & Risk Tagging */}
      <div className="luminous-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Utensils size={18} style={{ color: 'var(--amber-accent)' }} />
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--on-surface)' }}>
              Active Dining Menu & Hazard Tags
            </h2>
          </div>
          <span className="pill-badge badge-lavender">
            {items.length} Dishes Logged
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map((item) => {
            const isHigh = item.risk_tag === 'high';
            return (
              <div
                key={item.id}
                style={{
                  background: item.is_active ? 'var(--surface-container-low)' : 'var(--surface-container)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: item.is_active ? 1 : 0.6
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--on-surface)' }}>
                      {item.item_name}
                    </span>
                    <span className={`pill-badge ${isHigh ? 'badge-amber' : 'badge-lime'}`}>
                      {isHigh ? 'High Risk' : 'Normal'}
                    </span>
                    {!item.is_active && (
                      <span className="pill-badge badge-crimson">
                        Suspended
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)', marginTop: '3px' }}>
                    {item.mess_id} • {item.meal_type.toUpperCase()} • ~{item.estimated_servings} servings
                  </div>
                </div>

                {item.is_active ? (
                  <button
                    onClick={() => handleSuspend(item.id)}
                    className="btn-crimson"
                    style={{ padding: '6px 14px', fontSize: '0.76rem' }}
                  >
                    <ShieldBan size={13} />
                    Suspend
                  </button>
                ) : (
                  <span style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)', fontWeight: '600' }}>Quarantined</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Card: Register Meal Schedule Item */}
      <div className="luminous-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Plus size={18} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--on-surface)' }}>
            Register Dish in Daily Rotation
          </h2>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', marginBottom: '16px' }}>
          Dishes containing paneer, raw chutneys, or cold dairy are auto-tagged with a microbiological risk multiplier.
        </p>

        <form onSubmit={handleCreate}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '4px' }}>
              Mess Dining Facility:
            </label>
            <select
              value={messId}
              onChange={(e) => setMessId(e.target.value)}
              style={{ width: '100%', padding: '9px 14px', background: 'var(--surface-container-low)', border: '1px solid var(--surface-container)', borderRadius: 'var(--radius-md)', color: 'var(--on-surface)' }}
            >
              <option value="Mess_2_Girls">Mess 2 (Dining Hall 2)</option>
              <option value="Mess_1_Main">Mess 1 (Main Hall)</option>
            </select>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '4px' }}>
              Meal Service Slot:
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              style={{ width: '100%', padding: '9px 14px', background: 'var(--surface-container-low)', border: '1px solid var(--surface-container)', borderRadius: 'var(--radius-md)', color: 'var(--on-surface)' }}
            >
              <option value="dinner">Dinner</option>
              <option value="lunch">Lunch</option>
              <option value="breakfast">Breakfast</option>
              <option value="snacks">Evening Snacks</option>
            </select>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '4px' }}>
              Dish / Preparation Name:
            </label>
            <input
              type="text"
              placeholder="e.g. Shahi Paneer, Mint Chutney, Dal Fry"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              style={{ width: '100%', padding: '9px 14px', background: 'var(--surface-container-low)', border: '1px solid var(--surface-container)', borderRadius: 'var(--radius-md)', color: 'var(--on-surface)' }}
              required
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--on-surface)', marginBottom: '4px' }}>
              Estimated Student Servings:
            </label>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              style={{ width: '100%', padding: '9px 14px', background: 'var(--surface-container-low)', border: '1px solid var(--surface-container)', borderRadius: 'var(--radius-md)', color: 'var(--on-surface)' }}
            />
          </div>

          <button type="submit" className="btn-lime" style={{ width: '100%', justifyContent: 'center' }}>
            <Plus size={16} />
            Register Dish with Automated Risk Tag
          </button>
        </form>
      </div>

    </div>
  );
}
