import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; message?: string }> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }
  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) };
  }
  componentDidCatch(error: unknown) {
    console.error('[App ErrorBoundary]', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style="max-width:720px;margin:48px auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px;background:#fff">
          <h2 style="margin:0 0 12px;font-weight:700">Something went wrong</h2>
          <p style="margin:0 0 16px;color:#dc2626">{this.state.message}</p>
          <p style="margin:0;color:#64748b">Open DevTools (Ctrl+Shift+I) → Console untuk detail.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
