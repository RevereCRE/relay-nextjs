import type { AppProps } from 'next/app';
import type { Environment } from 'react-relay';
import { loadQuery } from 'react-relay/hooks';
import { WiredProps } from './component';
import {
  getWiredClientContext,
  getWiredErrorContext,
  getWiredServerContext,
} from './context';
import { getWiredSerializedState } from './serialized_state';
import { AnyPreloadedQuery } from './types';

function getWiredProps(
  pageProps: AppProps['pageProps'],
  initialPreloadedQuery: AnyPreloadedQuery | null
): Partial<WiredProps> {
  const errorContext = getWiredErrorContext(pageProps.__wired_error_context);

  const serverContext = getWiredServerContext(
    pageProps.__wired__server__context
  );

  const clientContext = getWiredClientContext(
    pageProps.__wired__client__context
  );

  const statusCode = errorContext?.statusCode ?? 200;
  const err = errorContext?.err;
  const CSN = clientContext != null;
  const preloadedQuery =
    clientContext?.preloadedQuery ??
    serverContext?.preloadedQuery ??
    initialPreloadedQuery!;

  return { CSN, statusCode, preloadedQuery, err };
}

function getInitialPreloadedQuery(opts: {
  createClientEnvironment: () => Environment;
}): AnyPreloadedQuery | null {
  if (typeof window === 'undefined') return null;
  const serializedState = getWiredSerializedState();
  if (serializedState == null || serializedState.query == null) return null;

  const env = opts.createClientEnvironment()!;
  return loadQuery(env, serializedState.query, serializedState.variables, {
    fetchPolicy: 'store-or-network',
  });
}

export { getWiredProps as getRelayProps, getInitialPreloadedQuery };
