import Error from 'next/error';
import { Component, PropsWithChildren } from 'react';

type WiredErrorBoundryProps = PropsWithChildren<unknown>;

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
    if (this.state.hasError) {
      return <Error statusCode={500} />;
    } else {
      return this.props.children;
    }
  }
}
