import type { AppProps } from 'next/app';
import type { Environment } from 'react-relay/hooks';
import { loadQuery } from 'react-relay/hooks';
import type { WiredProps } from './component';
import { getWiredClientContext, getWiredServerContext } from './context';
import { getWiredSerializedState } from './serialized_state';
import type { AnyPreloadedQuery } from './types';

export function getWiredProps(
  pageProps: AppProps['pageProps'],
  initialPreloadedQuery: AnyPreloadedQuery | null
): Partial<WiredProps> {
  const serverContext = getWiredServerContext(
    pageProps.__wired__server__context
  );

  const clientContext = getWiredClientContext(
    pageProps.__wired__client__context
  );

  const CSN = clientContext != null;
  const preloadedQuery =
    clientContext?.preloadedQuery ??
    serverContext?.preloadedQuery ??
    initialPreloadedQuery!;

  return { CSN, preloadedQuery };
}

export function getInitialPreloadedQuery(opts: {
  createClientEnvironment: () => Environment;
}): AnyPreloadedQuery | null {
  if (typeof window === 'undefined') return null;
  const serializedState = getWiredSerializedState();
  if (serializedState == null) return null;

  const env = opts.createClientEnvironment()!;
  return loadQuery(
    env,
    serializedState.operationDescriptor.request.node,
    serializedState.operationDescriptor.request.variables,
    {
      fetchPolicy: 'store-or-network',
    }
  );
}
