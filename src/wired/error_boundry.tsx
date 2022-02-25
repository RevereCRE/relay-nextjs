import Error, { ErrorProps } from 'next/error';
import React, { Component, PropsWithChildren } from 'react';
import { NextPageContext } from 'next';

export type WiredErrorBoundaryProps = PropsWithChildren<{
  ErrorComponent?: React.ComponentType<
    ErrorProps & { error: NextPageContext['err'] }
  >;
}>;

interface WiredErrorBoundaryState {
  hasError: boolean;
  error: NextPageContext['err'];
}

export class WiredErrorBoundary extends Component<
  WiredErrorBoundaryProps,
  WiredErrorBoundaryState
> {
  static getDerivedStateFromError(
    error: NextPageContext['err']
  ): WiredErrorBoundaryState {
    return { hasError: true, error };
  }

  state = {
    hasError: false,
    error: {
      name: 'Error 500',
      message: 'Unknown',
      stack: 'Unknown',
      statusCode: 500,
    },
  };

  render() {
    const ErrorComponent = this.props.ErrorComponent;

    // Something happened, let consumers decide what to do with this type of error
    let error: NextPageContext['err'] = {
      name: 'Error 500',
      message: 'Unknown',
      stack: 'Unknown',
      statusCode: 500,
    };

    // Because passing this.state.error won't work
    if (this.state.hasError)
      error = {
        name: 'Error 500',
        message: this.state.error ? this.state.error.toString() : 'Unknown',
        stack: this.state.error?.stack
          ? this.state.error.stack.toString()
          : 'Unknown',
        statusCode: 500,
      };

    if (this.state.hasError) {
      return ErrorComponent ? (
        <ErrorComponent statusCode={500} error={error} />
      ) : (
        <Error statusCode={500} error={error} />
      );
    } else {
      return this.props.children;
    }
  }
}
