import isEqual from 'lodash.isequal';
import type { NextPageContext, Redirect } from 'next';
import Router, { NextRouter, useRouter } from 'next/router';
import {
  ComponentType,
  ReactNode,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { PreloadedQuery, loadQuery, useRelayEnvironment } from 'react-relay';
import {
  ConcreteRequest,
  Environment,
  GraphQLResponse,
  GraphQLTaggedNode,
  OperationDescriptor,
  OperationType,
  RelayFeatureFlags,
  Variables,
  createOperationDescriptor,
} from 'relay-runtime';
import { HydrationMeta, collectMeta } from './json_meta';

export type AnyPreloadedQuery = PreloadedQuery<OperationType>;

// Enabling this feature flag to determine if a page should 404 on the server.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(RelayFeatureFlags as any).ENABLE_REQUIRED_DIRECTIVES = true;

export type RelayProps<
  P extends {} = {},
  Q extends OperationType = OperationType
> = P & Required<Pick<UseRelayNextJsProps<P, Q>, 'CSN' | 'preloadedQuery'>>;

export type UseRelayNextJsProps<
  P extends {} = {},
  Q extends OperationType = OperationType
> = P & {
  /** If this page rendering resulted from a client-side navigation. */
  CSN: boolean;
  /** Undefined during initial hydration, but defined for SSR and subsequent renders */
  preloadedQuery?: PreloadedQuery<Q>;
  operationDescriptor?: OperationDescriptor;
  payload?: GraphQLResponse;
  payloadMeta?: HydrationMeta;
};

export type OrRedirect<T> = T | { redirect: Redirect };

export interface RelayOptions<
  Props extends RelayProps,
  ServerSideProps extends {} = {}
> {
  /** Fallback rendered when the page suspends. */
  fallback?: ReactNode;
  variablesFromContext?: (
    ctx: NextPageContext | NextRouter
  ) => Props['preloadedQuery']['variables'];
  /** Called when creating a Relay environment on the client. Should be idempotent. */
  createClientEnvironment: () => Environment;
  /** Props passed to the component when rendering on the client. */
  clientSideProps?: (
    ctx: NextPageContext
  ) => OrRedirect<Partial<ServerSideProps>>;
  /** Called when creating a Relay environment on the server. */
  createServerEnvironment: (
    ctx: NextPageContext,
    props: ServerSideProps
  ) => Promise<Environment>;
  /** Props passed to the component when rendering on the server. */
  serverSideProps?: (
    ctx: NextPageContext
  ) => Promise<OrRedirect<ServerSideProps>>;
}

function defaultVariablesFromContext(
  ctx: NextPageContext | NextRouter
): Variables {
  return ctx.query;
}

export function withRelay<Props extends RelayProps, ServerSideProps extends {}>(
  Component: ComponentType<Props>,
  query: GraphQLTaggedNode,
  opts: RelayOptions<Props, ServerSideProps>
) {
  function useLoadedQuery(initialPreloadedQuery: Props['preloadedQuery']) {
    const router = useRouter();

    const lastQueryVariables = useRef<Variables>();
    const queryVariables = useMemo(() => {
      const nextQueryVariables = (
        opts.variablesFromContext ?? defaultVariablesFromContext
      )(router);

      // In the case that the previous query variables are not deep equal to the
      // next set of query variables update our reference. This ensures
      // Object.is equality is maintained across renders.
      if (
        lastQueryVariables.current == null ||
        !isEqual(lastQueryVariables.current, nextQueryVariables)
      ) {
        lastQueryVariables.current = nextQueryVariables;
      }

      return lastQueryVariables.current;
    }, [router]);

    const [preloadedQuery, setPreloadedQuery] = useState(initialPreloadedQuery);

    const isMountedRef = useRef(false);
    const env = useRelayEnvironment();
    useEffect(() => {
      // Avoid re-setting the initial preloaded query on the first render.
      if (!isMountedRef.current) {
        isMountedRef.current = true;
        return;
      }

      const nextPreloadedQuery = loadQuery(env, query, queryVariables, {
        fetchPolicy: 'store-or-network',
      });

      setPreloadedQuery(nextPreloadedQuery);
      return () => nextPreloadedQuery.dispose();
    }, [env, queryVariables]);

    return preloadedQuery;
  }

  function RelayComponent(props: Props) {
    const preloadedQuery = useLoadedQuery(props.preloadedQuery);
    return (
      <Suspense fallback={opts.fallback ?? 'Loading...'}>
        <Component {...props} preloadedQuery={preloadedQuery} />
      </Suspense>
    );
  }

  RelayComponent.getInitialProps = relayInitialProps(query, opts);

  return RelayComponent;
}

function relayInitialProps<
  Props extends RelayProps,
  ServerSideProps extends {}
>(query: GraphQLTaggedNode, opts: RelayOptions<Props, ServerSideProps>) {
  return async (ctx: NextPageContext): Promise<UseRelayNextJsProps> => {
    if (typeof window === 'undefined') {
      return getServerInitialProps(ctx, query, opts);
    } else {
      return getClientInitialProps(ctx, query, opts);
    }
  };
}

async function getServerInitialProps<
  Props extends RelayProps,
  ServerSideProps extends {}
>(
  ctx: NextPageContext,
  query: GraphQLTaggedNode,
  opts: RelayOptions<Props, ServerSideProps>
): Promise<UseRelayNextJsProps> {
  const { variablesFromContext = defaultVariablesFromContext } = opts;
  const serverSideProps = opts.serverSideProps
    ? await opts.serverSideProps(ctx)
    : ({} as ServerSideProps);

  if ('redirect' in serverSideProps) {
    const { redirect } = serverSideProps;

    let statusCode = 302;
    if ('statusCode' in redirect) {
      statusCode = redirect.statusCode;
    } else if ('permanent' in redirect) {
      statusCode = redirect.permanent ? 308 : 307;
    }

    ctx
      .res!.writeHead(statusCode, {
        Location: redirect.destination,
      })
      .end();

    return { CSN: false };
  }

  const env = await opts.createServerEnvironment(ctx, serverSideProps);
  const variables = variablesFromContext(ctx);
  const preloadedQuery = loadQuery(env, query, variables);

  const payload = await ensureQueryFlushed(preloadedQuery);
  const payloadSerializationMetadata = collectMeta(payload);
  const operationDescriptor = createOperationDescriptor(
    (query as unknown as { default: ConcreteRequest }).default,
    variables
  );

  const props: UseRelayNextJsProps = {
    ...serverSideProps,
    CSN: false,
    operationDescriptor,
    payload,
    payloadMeta: payloadSerializationMetadata,
  };

  // This will only be available during SSR, not during client side render or hydration.
  Object.defineProperty(props, 'preloadedQuery', {
    enumerable: false,
    value: preloadedQuery,
  });

  return props;
}

async function getClientInitialProps<
  Props extends RelayProps,
  ClientSideProps extends {}
>(
  ctx: NextPageContext,
  query: GraphQLTaggedNode,
  opts: RelayOptions<Props, ClientSideProps>
): Promise<UseRelayNextJsProps> {
  const { variablesFromContext = defaultVariablesFromContext } = opts;
  const clientSideProps = opts.clientSideProps
    ? opts.clientSideProps(ctx)
    : ({} as ClientSideProps);

  if ('redirect' in clientSideProps) {
    void Router.push(clientSideProps.redirect.destination);
    return { CSN: true };
  }

  const env = opts.createClientEnvironment();
  const variables = variablesFromContext(ctx);
  const preloadedQuery = loadQuery(env, query, variables, {
    fetchPolicy: 'store-and-network',
  });

  return {
    ...clientSideProps,
    CSN: true,
    preloadedQuery,
  };
}

async function ensureQueryFlushed(
  query: AnyPreloadedQuery
): Promise<GraphQLResponse> {
  return new Promise((resolve, reject) => {
    if (query.source == null) {
      resolve({ data: {} });
    } else {
      query.source.subscribe({
        next: resolve,
        error: reject,
      });
    }
  });
}
