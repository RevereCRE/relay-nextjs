---
title: Configuring relay-nextjs
---

## Installing `relay-nextjs`

Install using npm or your other favorite package manager:

```
npm install relay-nextjs
```

## Routing Integration

`relay-nextjs` must be configured in both a custom `_document` and `_app` to properly intercept and handle routing.

### Setting up the Relay Environment

For basic information about the Relay environment please see the [Relay docs](https://relay.dev/docs/getting-started/step-by-step-guide/#42-configure-relay-runtime).

`relay-nextjs` was designed with both client-side and server-side rendering in mind. As such it needs to be able to use either a client-side or server-side Relay environment. The library knows how to handle which environment to use, but we have to tell it how to create these environments. For this we will define two functions: `getClientEnvironment` and `createServerEnvironment`. Note the distinction — on the client only one environment is ever created because there is only one app, but on the server we must create an environment per-render to ensure the cache is not shared between requests.

First let’s define `getClientEnvironment`:

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

and then `createServerEnvironment`:

```tsx
import { graphql } from 'graphql';
import { withHydrateDatetime } from 'relay-nextjs/date';
import { GraphQLResponse, Network } from 'relay-runtime';
import { schema } from 'schema';

export function createServerNetwork() {
  return Network.create(async (text, variables) => {
    const context = {
      // If this function accepts an auth token you may add it here.
    };

    const results = await graphql({
      schema,
      source: text.text!,
      variableValues: variables,
      contextValue: context,
    });

    const data = JSON.parse(
      JSON.stringify(results),
      withHydrateDatetime
    ) as GraphQLResponse;

    return data;
  });
}

// Optional: this function can take a token used for authentication and pass it into `createServerNetwork`.
export function createServerEnvironment() {
  return new Environment({
    network: createServerNetwork(),
    store: new Store(new RecordSource()),
    isServer: true,
  });
}
```

Note in the example server environment we’re executing against a local schema but you may fetch from a remote API as well.

### Configuring `_document`

```tsx
// src/pages/_document.tsx
import { createRelayDocument, RelayDocument } from 'relay-nextjs/document';

interface DocumentProps {
  relayDocument: RelayDocument;
}

class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const relayDocument = createRelayDocument();

    const renderPage = ctx.renderPage;
    ctx.renderPage = () =>
      renderPage({
        enhanceApp: (App) => relayDocument.enhance(App),
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      relayDocument,
    };
  }

  render() {
    const { relayDocument } = this.props;

    return (
      <Html>
        <Head>
          {/* ... */}
          <relayDocument.Script />
        </Head>
        {/* ... */}
      </Html>
    );
  }
}
```

### Configuring `_app`

```tsx
// src/pages/_app.tsx
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { getInitialPreloadedQuery, getRelayProps } from 'relay-nextjs/app';
import { getClientEnvironment } from '../lib/client_environment';

const clientEnv = getClientEnvironment();
const initialPreloadedQuery = getInitialPreloadedQuery({
  createClientEnvironment: () => getClientEnvironment()!,
});

function MyApp({ Component, pageProps }: AppProps) {
  const relayProps = getRelayProps(pageProps, initialPreloadedQuery);
  const env = relayProps.preloadedQuery?.environment ?? clientEnv!;

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

function Profile({ preloadedQuery }: RelayProps<{}, profile_ProfileQuery>) {
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
  // This property is optional.
  error: MyCustomErrorComponent,
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
