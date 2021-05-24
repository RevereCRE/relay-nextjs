import type { NextPageContext, Redirect } from 'next';
import Router from 'next/router';
import React, { ComponentType, ReactNode, Suspense } from 'react';
import { loadQuery, PreloadedQuery } from 'react-relay/hooks';
import {
  Environment,
  GraphQLTaggedNode,
  OperationType,
  RelayFeatureFlags,
} from 'relay-runtime';
import { createWiredClientContext, createWiredServerContext } from './context';
import { WiredErrorBoundry } from './error_boundry';
import type { AnyPreloadedQuery } from './types';

// Enabling this feature flag to determine if a page should 404 on the server.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(RelayFeatureFlags as any).ENABLE_REQUIRED_DIRECTIVES = true;

export interface WiredOptions<ServerSideProps = {}> {
  fallback?: ReactNode;

  createClientEnvironment: () => Environment;

  clientSideProps?: (ctx: NextPageContext) => void | { redirect: Redirect };

  createServerEnvironment: (
    ctx: NextPageContext,
    props: ServerSideProps
  ) => Promise<Environment>;

  serverSideProps?: (
    ctx: NextPageContext
  ) => Promise<ServerSideProps | { redirect: Redirect }>;
}

export type WiredProps<
  P extends {} = {},
  Q extends OperationType = OperationType
> = P & {
  CSN: boolean;
  preloadedQuery: PreloadedQuery<Q>;
};

export function Wire<Props extends WiredProps, ServerSideProps>(
  Component: ComponentType<Props>,
  query: GraphQLTaggedNode,
  opts: WiredOptions<ServerSideProps>
) {
  function WiredComponent(props: Props) {
    if (props.CSN) {
      return (
        <WiredErrorBoundry>
          <Suspense fallback={opts.fallback ?? 'Loading...'}>
            <Component {...props} />
          </Suspense>
        </WiredErrorBoundry>
      );
    } else {
      return <Component {...props} />;
    }
  }

  WiredComponent.getInitialProps = wiredInitialProps(query, opts);

  return WiredComponent;
}

function wiredInitialProps<ServerSideProps>(
  query: GraphQLTaggedNode,
  opts: WiredOptions<ServerSideProps>
) {
  return async (ctx: NextPageContext) => {
    if (typeof window === 'undefined') {
      return getServerInitialProps(ctx, query, opts);
    } else {
      return getClientInitialProps(ctx, query, opts);
    }
  };
}

async function getServerInitialProps<ServerSideProps>(
  ctx: NextPageContext,
  query: GraphQLTaggedNode,
  opts: WiredOptions<ServerSideProps>
) {
  const serverSideProps = opts.serverSideProps
    ? await opts.serverSideProps(ctx)
    : ({} as ServerSideProps);

  if ('redirect' in serverSideProps) {
    ctx
      .res!.writeHead(302, {
        Location: serverSideProps.redirect.destination,
      })
      .end();

    return { __wired__server__context: {} };
  }

  const env = await opts.createServerEnvironment(ctx, serverSideProps);
  const variables = ctx.query;
  const preloadedQuery = loadQuery(env, query, variables);

  await ensureQueryFlushed(preloadedQuery);

  const context = createWiredServerContext({
    variables,
    query,
    preloadedQuery,
  });

  return {
    ...serverSideProps,
    __wired__server__context: context,
  };
}

function getClientInitialProps<ServerSideProps>(
  ctx: NextPageContext,
  query: GraphQLTaggedNode,
  opts: WiredOptions<ServerSideProps>
) {
  const clientSideProps = opts.clientSideProps
    ? opts.clientSideProps(ctx)
    : undefined;

  if (clientSideProps != null && 'redirect' in clientSideProps) {
    Router.push(clientSideProps.redirect.destination);
    return {};
  }

  const env = opts.createClientEnvironment();
  const variables = ctx.query;
  const preloadedQuery = loadQuery(env, query, variables, {
    fetchPolicy: 'store-and-network',
  });

  const context = createWiredClientContext({
    preloadedQuery,
  });

  return { __wired__client__context: context };
}

function ensureQueryFlushed(query: AnyPreloadedQuery): Promise<void> {
  return new Promise((resolve, reject) => {
    if (query.source == null) {
      resolve();
    } else {
      query.source.subscribe({
        complete: resolve,
        error: reject,
      });
    }
  });
}
