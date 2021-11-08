import Error from 'next/error';
import React, { Component, PropsWithChildren } from 'react';

type WiredErrorBoundaryProps = PropsWithChildren<{
  ErrorComponent?: React.ComponentType<any>;
}>;

interface WiredErrorBoundaryState {
  hasError: boolean;
}

export class WiredErrorBoundary extends Component<
  WiredErrorBoundaryProps,
  WiredErrorBoundaryState
> {
  static getDerivedStateFromError(): WiredErrorBoundaryState {
    return { hasError: true };
  }

  state = { hasError: false };

  render() {
    const ErrorComponent = this.props.ErrorComponent;

    if (this.state.hasError) {
      return ErrorComponent ? (
        <ErrorComponent statusCode={500} />
      ) : (
        <Error statusCode={500} />
      );
    } else {
      return this.props.children;
    }
  }
}
