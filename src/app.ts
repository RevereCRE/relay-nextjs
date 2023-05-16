/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { useMemo, useState } from 'react';
import type { Environment } from 'react-relay';
import { loadQuery } from 'react-relay';
import type { GraphQLSingularResponse } from 'relay-runtime';
import type { AnyPreloadedQuery, UseRelayNextJsProps } from './component';
import { hydrateObject } from './json_meta';

export function useRelayNextjs(
  props: UseRelayNextJsProps,
  opts: { createClientEnvironment: () => Environment }
): { env: Environment; preloadedQuery?: AnyPreloadedQuery; CSN: boolean } {
  const [relayEnvironment] = useState(() => {
    if (props.preloadedQuery?.environment) {
      return props.preloadedQuery.environment;
    }

    const env = opts.createClientEnvironment();
    if (props.payload && props.payloadMeta && props.operationDescriptor) {
      hydrateObject(props.payloadMeta, props.payload);

      // After SSR, during initial render (hydration), the store is empty.
      // `getInitialProps` from the server gives us data to "replay" the data
      // fetching allowing us to "hydrate" the store, ensuring the initial
      // render matches the server's.
      env.commitPayload(
        props.operationDescriptor,
        (props.payload as GraphQLSingularResponse).data!
      );
    }

    return env;
  });

  const preloadedQuery = useMemo(() => {
    if (props.preloadedQuery) {
      // During SSR and client-side navigations this will be defined.
      return props.preloadedQuery;
    } else if (props.operationDescriptor) {
      // During initial hydration we don't have a reference to the preloadedQuery
      // from the server because it cannot be serialized. In that case we recreate
      // it from store data.
      return loadQuery(
        relayEnvironment,
        props.operationDescriptor.request.node,
        props.operationDescriptor.request.variables,
        { fetchPolicy: 'store-or-network' }
      );
    } else {
      // If the page we landed on doesn't have these props defined it is not a
      // page using relay-nextjs, so we should just return undefined.
      return undefined;
    }
  }, [props, relayEnvironment]);

  return { env: relayEnvironment, preloadedQuery, CSN: props.CSN };
}
