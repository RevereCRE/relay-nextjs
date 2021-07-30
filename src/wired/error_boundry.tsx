import Error from 'next/error';
import React, { Component, PropsWithChildren } from 'react';

type WiredErrorBoundryProps = PropsWithChildren<{
  ErrorComponent?: React.ComponentType<any>;
}>;

interface WiredErrorBoundryState {
  hasError: boolean;
}

export class WiredErrorBoundry extends Component<
  WiredErrorBoundryProps,
  WiredErrorBoundryState
> {
  static getDerivedStateFromError(): WiredErrorBoundryState {
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
