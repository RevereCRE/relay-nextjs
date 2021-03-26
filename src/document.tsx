import type { DocumentContext } from 'next/document';
import { ComponentType } from 'react';
import serialize from 'serialize-javascript';
import { getWiredServerContext, WiredServerContext } from './context';
import { WiredSerializedState } from './serialized_state';

// This is all to get the type of `enhanceApp` because it not exported by Next.
type RenderPage = DocumentContext['renderPage'];
type RenderPageParam = NonNullable<Parameters<RenderPage>[0]>;
type WithoutFunction<T> = T extends (c: infer C) => unknown ? never : T;
type RenderPageOptions = WithoutFunction<RenderPageParam>;
type AppEnhancer = NonNullable<RenderPageOptions['enhanceApp']>;

interface WiredDocument {
  enhance: AppEnhancer;
  Script: ComponentType;
}

function createWiredDocument(): WiredDocument {
  let capturedWiredContext: WiredServerContext | undefined;

  const enhance: WiredDocument['enhance'] = (App) => {
    return (props) => {
      capturedWiredContext = getWiredServerContext(
        props.pageProps.__wired__server__context
      );

      return <App {...props} />;
    };
  };

  const Script = () => {
    if (capturedWiredContext == null) return null;

    const records = capturedWiredContext.preloadedQuery.environment
      .getStore()
      .getSource()
      .toJSON();

    const serializedState: WiredSerializedState = {
      records,
      query: capturedWiredContext.query,
      variables: capturedWiredContext.variables,
    };

    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__wired__=${serialize(serializedState)}`,
        }}
      />
    );
  };

  return { enhance, Script };
}

export type { WiredDocument as RelayDocument };
export { createWiredDocument as createRelayDocument };
