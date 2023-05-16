import { getClientEnvironment } from 'lib/relay_client_environment';
import type { AppProps } from 'next/app';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { useRelayNextjs } from 'relay-nextjs/app';
import 'tailwindcss/tailwind.css';

function ExampleApp({ Component, pageProps }: AppProps) {
  const { env, ...relayProps } = useRelayNextjs(pageProps, {
    createClientEnvironment: () => getClientEnvironment()!,
  });

  return (
    <RelayEnvironmentProvider environment={env}>
      <Component {...pageProps} {...relayProps} />
    </RelayEnvironmentProvider>
  );
}

export default ExampleApp;
