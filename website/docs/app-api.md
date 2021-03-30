---
title: Relay App API
---

`relay-nextjs/app` is a set of APIs intended for use with a custom `App` in Next.js.

## `getInitialPreloadedQuery`

Returns a [`PreloadedQuery`](https://relay.dev/docs/api-reference/use-preloaded-query)
required for the initial page. Example usage:

```tsx
const initialPreloadedQuery = getInitialPreloadedQuery({
  createClientEnvironment: () => getClientSideEnvironment(),
});
```

### Arguments

- `options`:
  - `options.createClientEnvironment`: A function that returns a `RelayEnvironment`. Should return
    the same environment each time it is called.

## `getRelayProps`

Creates an object containing props needed to render a page using `relay-nextjs`.
Example usage:

```tsx
// src/pages/_app.tsx
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { getInitialPreloadedQuery, getRelayProps } from 'relay-nextjs/app';

// This function should return a RelayEnvironment pointed at your GraphQL API.
// Note that this should always return the same object, **not** create a new
// RelayEnvironment on every call.
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
