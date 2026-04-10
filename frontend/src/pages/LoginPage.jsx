import React from 'react';
import { LoginForm } from '../components/Auth/LoginForm';
import { PageWrapper } from '../components/Layout/PageWrapper';

function MedicalCross({ size = 48 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      style={{ color: 'var(--primary)' }}
    >
      <rect x="4" y="4" width="40" height="40" rx="10" fill="currentColor" opacity="0.12" />
      <path
        d="M22 14h4v8h8v4h-8v8h-4v-8h-8v-4h8v-8z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'var(--primary-light)',
      }}
    >
      <PageWrapper>
        <div style={{ width: '100%', maxWidth: 420, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <MedicalCross />
          <h1
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: 28,
              marginTop: 12,
              color: 'var(--text-primary)',
            }}
          >
            Clínica Portal
          </h1>
        </div>
        <div
          className="card"
          style={{
            padding: 28,
            boxShadow: 'var(--shadow-md)',
            maxWidth: 420,
            margin: '0 auto',
          }}
        >
          <LoginForm />
        </div>
        </div>
      </PageWrapper>
    </div>
  );
}
