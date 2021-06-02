---
title: What is relay-nextjs
slug: /
---

`relay-nextjs` is a bridge between [Next.js](https://nextjs.org/) and
[Relay](https://relay.dev). Because these are two highly opinionated frameworks
it can be difficult to get them to work together. This library solves that
problem by glueing the two together using techniques that require low-level
knowledge of both frameworks.

Basically we wrote the glue code for you!

This library has several goals:

- Use Relay with no modifications, be able to copy code exactly as is from the
  docs
- Use only documented public APIs of React, Relay, and Next.js to prevent
  lock-in
- Does not require modifications to pages not using Relay
- Incremental adoption across your app
