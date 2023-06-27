---
title: Prerequisites
---

First check out the [Relay docs](https://relay.dev) and the
[Relay prerequisites](https://relay.dev/docs/getting-started/prerequisites/).
Then make sure you are ready with each of the following.

## A Next.js project using [Page Router](https://nextjs.org/docs/pages)

:::info

`relay-nextjs` does not support [Nextjs 13 App Router](https://nextjs.org/docs/app) at the moment.

See [GitHub issue #89](https://github.com/RevereCRE/relay-nextjs/issues/89) for more info.

:::

`relay-nextjs` is meant to integrate the Relay framework with Next.js. If you're
not using Next.js you don't need this project. The rest of this guide will
assume your project is using **TypeScript** and the page to your pages is
`src/pages`.

Relay generates artifacts in a single directory. To avoid traversing directories
as much it will be helpful to configure TypeScript with the following `baseUrl`:

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./src"
  }
}
```

## A GraphQL API and Schema

Relay uses a GraphQL API to fetch data and compiles queries against a GraphQL
schema. This guide assumes a local schema (a `.graphql` file). To set up Relay
with a remote schema please see the
[Relay Compiler docs](https://relay.dev/docs/guides/compiler/).
