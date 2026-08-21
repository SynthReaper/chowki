/**
 * @component ErrorBoundary
 * @project Project CHOWKI — Campus Outbreak Surveillance System
 * @author Synthreaper | github.com/synthreaper/chowki
 * @description React Error Boundary to catch render issues gracefully
 * @lastModified 2026-08-22
 */

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          maxWidth: '600px',
          margin: '60px auto',
          padding: '32px',
          background: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          textAlign: 'center',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#FFDAD6',
            color: '#BA1A1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <AlertTriangle size={28} />
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#191C1F', marginBottom: '8px' }}>
            Telemetry Interface Loaded with Recoverable Exception
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#5F6E7B', marginBottom: '20px' }}>
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            style={{
              background: '#D9FF5F',
              color: '#2A3600',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '9999px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <RefreshCw size={16} />
            Reload Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
