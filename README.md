`relay-nextjs` acts as a bridge between Next.js and Relay.

`relay-nextjs` wraps page components, a GraphQL query, and some helper methods to
automatically hook up data fetching using Relay. On initial load a Relay
environment is created, the data is fetched server-side, the page is rendered,
and resulting state is serialized as a script tag. On boot in the client a new
Relay environment and preloaded query are created using that serialized state.
Data is fetched using the client-side Relay environment on subsequent navigations.

## Getting Started

Install using npm or your other favorite package manager:

```sh
$ npm install relay-nextjs
```

`relay-nextjs` must be configured in both a custom `_document` and `_app` to properly
intercept and handle routing.

### Configuring `_document`

```tsx
// pages/_document.tsx
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
```

### Configuring `_app`

```tsx
// pages/_app.tsx
import { getInitialPreloadedQuery, getRelayProps } from 'relay-nextjs/app';

const clientSideEnv = getClientSideEnvironment();
const initialPreloadedQuery = getInitialPreloadedQuery({
  createClientEnvironment: () => getClientSideEnvironment()!,
});

function MyApp({ Component, pageProps }: AppProps) {
  const relayProps = getRelayProps(pageProps, initialPreloadedQuery);
  const env = relayProps.preloadedQuery?.environment ?? clientSideEnv!;

  return (
    <>
      <RelayEnvironmentProvider environment={env}>
        <Component {...pageProps} {...wiredProps} />
      </RelayEnvironmentProvider>
    </>
  );
}

export default MyApp;
```

## Usage in a Page

```tsx
// pages/user/[uuid].tsx
import { withRelay, RelayProps } from 'lib/shared/wired';

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

export default Wire(UserProfile, UserProfileQuery, {
  // This property is optional.
  error: MyCustomErrorComponent,
  // Fallback to render while the page is loading.
  fallback: <Loading />,
  // Create a Relay environment on the client-side.
  // Note: This function must always return the same value.
  createClientEnvironment: () => getClientSideEnvironment()!,
  // Gets server side props for the page.
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
  // Server side props can be accessed as the second argument
  // to this function.
  createServerEnvironment: async (
    ctx,
    { token }: { token: TokenWithClaims }
  ) => {
    const { createServerNetwork } = await import(
      'lib/server/relay_server_network'
    );

    return new Environment({
      network: createServerNetwork(token),
      store: new Store(new RecordSource()),
      isServer: true,
    });
  },
});
```
