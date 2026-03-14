'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from './error-boundary';
import { Toaster } from './ui/toaster';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
      <Toaster />
    </ErrorBoundary>
  );
}
