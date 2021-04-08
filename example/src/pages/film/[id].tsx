import { getClientEnvironment } from 'lib/relay_client_environment';
import Link from 'next/link';
import type { Id_filmDescription$key } from 'queries/__generated__/Id_filmDescription.graphql';
import type { Id_filmQuery } from 'queries/__generated__/Id_filmQuery.graphql';
import React from 'react';
import { graphql, useFragment, usePreloadedQuery } from 'react-relay';
import type { RelayProps } from 'relay-nextjs';
import { withRelay } from 'relay-nextjs';

function FilmDescription(props: { film: Id_filmDescription$key }) {
  const film = useFragment(
    graphql`
      fragment Id_filmDescription on Film {
        director
        openingCrawl
      }
    `,
    props.film
  );

  return (
    <div className="flex flex-col items-center text-center">
      <p>Directed by {film.director}</p>
      <p>{film.openingCrawl}</p>
    </div>
  );
}

const FilmQuery = graphql`
  query Id_filmQuery($id: ID!) {
    film(id: $id) {
      title

      ...Id_filmDescription
    }
  }
`;

function Film({ preloadedQuery }: RelayProps<{}, Id_filmQuery>) {
  const query = usePreloadedQuery(FilmQuery, preloadedQuery);
  if (query.film == null) return null;

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="flex items-center justify-center w-full pb-3">
        <Link href="/">
          <a className="text-blue-500 hover:underline mr-3">« Home</a>
        </Link>
        <h1 className="text-center text-3xl font-semibold">
          {query.film.title}
        </h1>
      </div>

      <FilmDescription film={query.film} />
    </div>
  );
}

export default withRelay(Film, FilmQuery, {
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async () => {
    const { createServerEnvironment } = await import(
      'lib/server/relay_server_environment'
    );

    return createServerEnvironment();
  },
});
