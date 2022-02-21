---
title: Relay Page API
---

## `withRelay`

Wraps a component, GraphQL query, and a set of options to manage loading the
page and its data, as specified by the query. Example usage:

```tsx
// src/pages/user/[uuid].tsx
import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql, usePreloadedQuery } from 'react-relay/hooks';

// The $uuid variable is injected automatically from the route.
const ProfileQuery = graphql`
  query profile_ProfileQuery($uuid: ID!) {
    user(id: $uuid) {
      id
      firstName
      lastName
    }
  }
`;

function UserProfile({ preloadedQuery }: RelayProps<{}, profile_ProfileQuery>) {
  const query = usePreloadedQuery(ProfileQuery, preloadedQuery);

  return (
    <div>
      Hello {query.user.firstName} {query.user.lastName}
    </div>
  );
}

export default withRelay(UserProfile, UserProfileQuery, options);
```

### Arguments

- `component`: A
  [Next.js page component](https://nextjs.org/docs/basic-features/pages) to
  recieve the preloaded query from `relay-nextjs`.
- `query`: A GraphQL query using the `graphql` tag from Relay.
- `options`: A [`RelayOptions`](#relayoptions) object.

## `RelayOptions`

Interface for configuring `withRelay`. Example usage:

```tsx
const options: RelayOptions<{ token: string }> = {
  fallback: <Loading />,
  fetchPolicy: 'store-and-network',
  createClientEnvironment: () => getClientEnvironment()!,
  serverSideProps: async (ctx) => {
    const { getTokenFromCtx } = await import('lib/server/auth');
    const token = await getTokenFromCtx(ctx);
    if (token == null) {
      return {
        redirect: { destination: '/login', permanent: false },
      };
    }

    return { token };
  },
  createServerEnvironment: async (ctx, { token }) => {
    const { createServerEnvironment } = await import('lib/server_environment');
    return createServerEnvironment(token);
  },
};
```

### Properties

- `fallback?`: React component to use as a loading indicator. See
  [React Suspense docs](https://reactjs.org/docs/concurrent-mode-suspense.html).
- `fetchPolicy?`: Relay fetch policy. Defaults to `store-and-network`. See
  [Relay docs](https://relay.dev/docs/guided-tour/reusing-cached-data/fetch-policies/).
- `clientSideProps?`: Provides props to the page on client-side navigations. Not
  required.
- `createClientEnvironment`: A function that returns a `RelayEnvironment`.
  Should return the same environment each time it is called.
- `serverSideProps?`: Fetch any server-side only props such as authentication
  tokens. Note that you should import server-only deps with
  `await import('...')`.
- `createServerEnvironment`: A function that returns a `RelayEnvironment`. First
  argument is `NextPageContext` and the second is the object returned by
  `serverSideProps`.
- `variablesFromContext?`: Function that extracts GraphQL query variables from
  `NextPageContext`. Run on both the client and server. If omitted query
  variables are set to `ctx.query`.

## `getRelaySerializedState`

Returns serialized data collected from server-rendering. Should be used to
create create a `RecordSource`. Example usage:

```tsx
// lib/client_environment.ts
import { getRelaySerializedState } from 'relay-nextjs';
import { withHydrateDatetime } from 'relay-nextjs/date';
import { Environment, Network, Store, RecordSource } from 'relay-runtime';

export function createClientNetwork() {
  return Network.create(async (params, variables) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: params.text,
        variables,
      }),
    });

    const json = await response.text();
    return JSON.parse(json, withHydrateDatetime);
  });
}

let clientEnv: Environment | undefined;
export function getClientEnvironment() {
  if (typeof window === 'undefined') return null;

  if (clientEnv == null) {
    clientEnv = new Environment({
      network: createClientNetwork(),
      store: new Store(new RecordSource(getRelaySerializedState()?.records)),
      isServer: false,
    });
  }

  return clientEnv;
}
```
