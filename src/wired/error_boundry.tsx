import Error, { ErrorProps } from 'next/error';
import React, { Component, PropsWithChildren } from 'react';
import { NextPageContext } from 'next';

export type WiredErrorBoundaryProps = PropsWithChildren<{
  ErrorComponent?: React.ComponentType<
    ErrorProps & { error: NextPageContext['err'] }
  >;
}>;

interface WiredErrorBoundaryState {
  error?: NextPageContext['err'] | false;
}

export class WiredErrorBoundary extends Component<
  WiredErrorBoundaryProps,
  WiredErrorBoundaryState
> {
  static getDerivedStateFromError(
    error: NextPageContext['err']
  ): WiredErrorBoundaryState {
    return { error };
  }

  state: { error? : NextPageContext['err'] | false } = { error: false }

  render() {
    const ErrorComponent = this.props.ErrorComponent;

    if (this.state.error) {
      return ErrorComponent ? (
        <ErrorComponent statusCode={500} error={this.state.error} />
      ) : (
        <Error statusCode={500} error={this.state.error} />
      );
    } else {
      return this.props.children;
    }
  }
}
