import React from 'react';

export function PageWrapper({ children, className = '' }) {
  return <div className={`page ${className}`.trim()}>{children}</div>;
}
