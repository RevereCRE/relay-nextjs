---
title: Relay App API
---

`relay-nextjs/app` exposes a single hook to configure your app to use Relay.

## `useRelayNextjs`

Returns an object containing an `Environment` and props needed to render a page
using `relay-nextjs`. Example usage:

```tsx
// src/pages/_app.tsx
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { useRelayNextjs } from 'relay-nextjs/app';

// This function should return a RelayEnvironment pointed at your GraphQL API.
// Note that this should always return the same object, **not** create a new
// RelayEnvironment on every call.
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
