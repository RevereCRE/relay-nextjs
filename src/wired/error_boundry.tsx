import Error, { ErrorProps } from 'next/error';
import React, { Component, PropsWithChildren } from 'react';
import { NextPageContext } from 'next';

export type WiredErrorBoundaryProps = PropsWithChildren<{
  ErrorComponent?: React.ComponentType<
    ErrorProps & { error: NextPageContext['err'] }
  >;
}>;

interface WiredErrorBoundaryState {
  error?: NextPageContext['err'];
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

  render() {
    const ErrorComponent = this.props.ErrorComponent;

    // Something happened, let consumers decide what to do with this type of error
    let error: NextPageContext['err'];

    // Because passing this.state.error won't work
    if (this.state.error)
      error = {
        name: 'Error 500',
        message: this.state.error ? this.state.error.toString() : 'Unknown',
        stack: this.state.error?.stack
          ? this.state.error.stack.toString()
          : 'Unknown',
        statusCode: 500,
      };

    // eslint-disable-next-line no-console
    console.log('error_boundary:error', error);

    if (error) {
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
