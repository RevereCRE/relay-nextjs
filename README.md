<p align="center">
  <b>Revere CRE is hiring! Interested in working on the cutting edge of frontend?</b>
  <br>
  <b>Reach out to <a href="mailto:eng-jobs@reverecre.com">eng-jobs@reverecre.com</a> for more information.</b>
</p>

<h1 align="center">
  Relay + Next.js
</h1>

[![npm version](https://badge.fury.io/js/relay-nextjs.svg)](https://badge.fury.io/js/relay-nextjs)
![npm downloads](https://img.shields.io/npm/dm/relay-nextjs)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/relay-nextjs)

<p align="center">
  <a href="https://reverecre.github.io/relay-nextjs"><b>Documentation</b></a> |
  <a href="https://github.com/RevereCRE/relay-nextjs/discussions"><b>Discussion</b></a> |
  <a href="https://github.com/RevereCRE/relay-nextjs/releases"><b>Latest Releases</b></a>
</p>
 
<p align="center">
  <code>relay-nextjs</code> is the best way to use Relay and Next.js in the same project! It supports
  <b>incremental migration</b>, is <b>suspense ready</b>, and is <b>run in production</b> by major
  companies.
</p>

## Overview

`relay-nextjs` wraps page components, a GraphQL query, and some helper methods
to automatically hook up data fetching using Relay. On initial load a Relay
environment is created, the data is fetched server-side, the page is rendered,
and resulting state is serialized as a script tag. On boot in the client a new
Relay environment and preloaded query are created using that serialized state.
Data is fetched using the client-side Relay environment on subsequent
navigations.

Note: `relay-nextjs` does not support [Nextjs 13 App Router](https://nextjs.org/docs/app) at the moment.

- See [GitHub issue #89](https://github.com/RevereCRE/relay-nextjs/issues/89) for more info.

## Getting Started

Install using npm or your other favorite package manager:

```sh
$ npm install relay-nextjs
```

`relay-nextjs` must be configured in `_app` to properly intercept and handle
routing.

### Setting up the Relay Environment

For basic information about the Relay environment please see the
[Relay docs](https://relay.dev/docs/getting-started/step-by-step-guide/#42-configure-relay-runtime).

`relay-nextjs` was designed with both client-side and server-side rendering in
mind. As such it needs to be able to use either a client-side or server-side
Relay environment. The library knows how to handle which environment to use, but
we have to tell it how to create these environments. For this we will define two
functions: `getClientEnvironment` and `createServerEnvironment`. Note the
distinction — on the client only one environment is ever created because there
is only one app, but on the server we must create an environment per-render to
ensure the cache is not shared between requests.

First we'll define `getClientEnvironment`:

```tsx
// lib/client_environment.ts
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
    return JSON.parse(json);
  });
}

let clientEnv: Environment | undefined;
export function getClientEnvironment() {
  if (typeof window === 'undefined') return null;

  if (clientEnv == null) {
    clientEnv = new Environment({
      network: createClientNetwork(),
      store: new Store(new RecordSource()),
      isServer: false,
    });
  }

  return clientEnv;
}
```

and then `createServerEnvironment`:

```tsx
import { graphql } from 'graphql';
import { GraphQLResponse, Network } from 'relay-runtime';
import { schema } from 'lib/schema';

export function createServerNetwork() {
  return Network.create(async (text, variables) => {
    const context = {
      token,
      // More context variables here
    };

    const results = await graphql({
      schema,
      source: text.text!,
      variableValues: variables,
      contextValue: context,
    });

    return JSON.parse(JSON.stringify(results)) as GraphQLResponse;
  });
}

export function createServerEnvironment() {
  return new Environment({
    network: createServerNetwork(),
    store: new Store(new RecordSource()),
    isServer: true,
  });
}
```

Note in the example server environment we’re executing against a local schema
but you may fetch from a remote API as well.

### Configuring `_app`

```tsx
// pages/_app.tsx
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { useRelayNextjs } from 'relay-nextjs/app';
import { getClientEnvironment } from '../lib/client_environment';

function MyApp({ Component, pageProps }: AppProps) {
  const { env, ...relayProps } = useRelayNextjs(pageProps, {
    createClientEnvironment: () => getClientSideEnvironment()!,
  });

  return (
    <>
      <RelayEnvironmentProvider environment={env}>
        <Component {...pageProps} {...relayProps} />
      </RelayEnvironmentProvider>
    </>
  );
}

export default MyApp;
```

## Usage in a Page

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

function Loading() {
  return <div>Loading...</div>;
}

export default withRelay(UserProfile, UserProfileQuery, {
  // Fallback to render while the page is loading.
  // This property is optional.
  fallback: <Loading />,
  // Create a Relay environment on the client-side.
  // Note: This function must always return the same value.
  createClientEnvironment: () => getClientEnvironment()!,
  // Gets server side props for the page.
  serverSideProps: async (ctx) => {
    // This is an example of getting an auth token from the request context.
    // If you don't need to authenticate users this can be removed and return an
    // empty object instead.
    const { getTokenFromCtx } = await import('lib/server/auth');
    const token = await getTokenFromCtx(ctx);
    if (token == null) {
      return {
        redirect: { destination: '/login', permanent: false },
      };
    }

    return { token };
  },
  // Server-side props can be accessed as the second argument
  // to this function.
  createServerEnvironment: async (
    ctx,
    // The object returned from serverSideProps. If you don't need a token
    // you can remove this argument.
    { token }: { token: string }
  ) => {
    const { createServerEnvironment } = await import('lib/server_environment');
    return createServerEnvironment(token);
  },
});
```
