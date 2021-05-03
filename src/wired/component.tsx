import { GraphQLFormattedError } from 'graphql';
import type { NextPageContext, Redirect } from 'next';
import NextError, { ErrorProps } from 'next/error';
import Router from 'next/router';
import React, { ComponentType, ReactNode, Suspense } from 'react';
import { loadQuery, PreloadedQuery } from 'react-relay/hooks';
import type {
  Environment,
  GraphQLTaggedNode,
  OperationType,
} from 'relay-runtime';
import {
  createWiredClientContext,
  createWiredErrorContext,
  createWiredServerContext,
} from './context';
import { WiredErrorBoundry } from './error_boundry';
import { AnyPreloadedQuery } from './types';

export interface WiredOptions<ServerSideProps = {}> {
  error?: React.ComponentType<ErrorProps & { err?: unknown }>;
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

  //TODO: Incomplete, can we infer query variables type here?
  queryVariables: (ctx: NextPageContext) => { [key: string]: any };
}

export type WiredProps<
  P extends {} = {},
  Q extends OperationType = OperationType
> = P & {
  CSN: boolean;
  err?: unknown;
  statusCode: number;
  preloadedQuery: PreloadedQuery<Q>;
};

export function Wire<Props extends WiredProps, ServerSideProps>(
  Component: ComponentType<Props>,
  query: GraphQLTaggedNode,
  opts: WiredOptions<ServerSideProps>
) {
  function WiredComponent(props: Props) {
    const isError =
      props.err != null ||
      `${props.statusCode}`.startsWith('4') ||
      `${props.statusCode}`.startsWith('5');

    if (isError) {
      const ErrorComponent = opts.error ?? NextError;
      return <ErrorComponent err={props.err} statusCode={props.statusCode} />;
    } else if (props.CSN) {
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
  const variables = opts.queryVariables(ctx);
  const preloadedQuery = loadQuery(env, query, {
    ...ctx.query,
    ...variables,
  });

  try {
    await ensureQueryFlushed(preloadedQuery);
  } catch (e) {
    if (e.source?.errors != null) {
      const graphqlErrors = e.source.errors as GraphQLFormattedError[];
      const isNotFound = graphqlErrors.some((e) =>
        e.message.startsWith('Cannot return null for non-nullable field')
      );

      if (isNotFound) {
        ctx.res!.statusCode = 404;

        const context = createWiredErrorContext({
          statusCode: 404,
          err: e.source.errors,
        });

        return { __wired_error_context: context };
      }
    }

    throw e;
  }

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
