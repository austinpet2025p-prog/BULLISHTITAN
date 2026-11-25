import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from './Button';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#000000] text-[#EDE6D6] flex items-center justify-center p-6">
          <div className="max-w-md rounded-2xl hairline-gold-bright p-8 text-center">
            <ShieldAlert className="mx-auto h-10 w-10 text-[#C9A24B] mb-3" />
            <h1 className="font-display text-xl font-semibold">
              Unable to Render Section
            </h1>
            <p className="mt-2 text-sm text-[#9A968C]">
              An unexpected display issue occurred. Reload the page to restore your session safely.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
              <Button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.href = '/';
                }}
              >
                Return Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
