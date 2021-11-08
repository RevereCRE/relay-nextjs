import type { ParsedUrlQuery } from 'querystring';
import type { GraphQLTaggedNode } from 'react-relay/hooks';
import type { AnyPreloadedQuery } from './types';

const WIRED_CONTEXT = Symbol('WIRED');

export interface WiredServerContext {
  query: GraphQLTaggedNode;
  preloadedQuery: AnyPreloadedQuery;
  variables: ParsedUrlQuery;
}

export function createWiredServerContext(value: WiredServerContext) {
  const context = {};
  Object.defineProperty(context, WIRED_CONTEXT, {
    enumerable: false,
    value: value,
  });

  return context;
}

export function getWiredServerContext(
  // Wired context values can be attached to any type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
): WiredServerContext | undefined {
  if (context == null) return undefined;
  return context[WIRED_CONTEXT];
}

export interface WiredClientContext {
  preloadedQuery: AnyPreloadedQuery;
}

export function createWiredClientContext(value: WiredClientContext) {
  const context = {};
  Object.defineProperty(context, WIRED_CONTEXT, {
    enumerable: false,
    value: value,
  });

  return context;
}

export function getWiredClientContext(
  // Wired context values can be attached to any type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
): WiredClientContext | undefined {
  if (context == null) return undefined;
  return context[WIRED_CONTEXT];
}

export interface WiredErrorContext {
  statusCode: number;
  err?: unknown;
}
