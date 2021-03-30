---
title: Relay Document API
---

`relay-nextjs/document` is a set of APIs intended for use with a custom `Document` in Next.js.

## `createRelayDocument`

Creates a new [`RelayDocument`](#relaydocument).

## `RelayDocument`

Collects state needed for serialization when rendering on the server.

### `enhance`

Enhances the `renderPage` API exposed by Next.js. Example usage:

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
    // ...
  }
}
```

### `Script`

A React component that renders a script tag containing serialized state. Exmaple usage:

```tsx
class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    // ...
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
