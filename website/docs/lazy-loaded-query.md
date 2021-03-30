---
title: Lazy-loaded Queries
---

Relay's [`useLazyLoadQuery` API](https://relay.dev/docs/api-reference/use-lazy-load-query/) let us
defer loading queries until a component is mounted. To render a loading state while the query is
pending the docs recommended adding a `<Suspense>` boundary. Next.js and `relay-nextjs` both expect
to be able to render on the server and as of the time of writing React Suspense does not support
server rendering. When using `withRelay` and `usePreloadedQuery` we take care of adding the `<Suspense>`
boundary for you but we cannot here.

To use `useLazyLoadQuery` and render a `<Suspense>` boundary you must create a dynamically rendered
component that skips SSR. For example:

```tsx
// src/components/user_stats.tsx
import type { userStats_Birthday } from 'queries/__generated__/userStats_Birthday.graphql';
import React, { Suspense, useCallback } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';

function UserBirthday({ uuid }: { uuid: string }) {
  const query = useLazyLoadQuery<userStats_Birthday>(
    graphql`
      query userStats_Birthday($uuid: ID!) {
        user(id: $uuid) {
          birthday
        }
      }
    `,
    { uuid }
  );

  return <div>Birthday is {query.user.birthday}!</div>;
}

function UserStats({ uuid }: { uuid: string }) {
  return (
    <Suspense fallback="Loading...">
      <UserBirthday uuid={uuid} />
    </Suspense>
  );
}

export default UserStats;
```

Note that we have two components here: one that has a `<Suspense>` boundary and one that actually
calls `useLazyLoadQuery`. If these two were merged into the same component there would be no boundary
to catch `useLazyLoadQuery` suspending!

To render this component use the [Next.js `dynamic` API](https://nextjs.org/docs/advanced-features/dynamic-import):

```tsx
// src/pages/user_profile.tsx
import dynamic from 'next/dynamic';

const UserStats = dynamic(() => import('components/components/user_stats'), {
  ssr: false,
});

function UserProfile({ uuid }: { uuid: string }) {
  return (
    <div>
      {/* ... */}
      <UserStats uuid={uuid} />
    </div>
  );
}
```
