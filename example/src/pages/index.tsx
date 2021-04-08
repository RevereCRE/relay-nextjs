import { getClientEnvironment } from 'lib/relay_client_environment';
import type { pages_listFilmsQuery } from 'queries/__generated__/pages_listFilmsQuery.graphql';
import React from 'react';
import { graphql, usePreloadedQuery } from 'react-relay';
import type { RelayProps } from 'relay-nextjs';
import { withRelay } from 'relay-nextjs';
import Link from 'next/link';

const FilmListQuery = graphql`
  query pages_listFilmsQuery {
    allFilms {
      films {
        id
        title
        openingCrawl
      }
    }
  }
`;

function FilmList({ preloadedQuery }: RelayProps<{}, pages_listFilmsQuery>) {
  const query = usePreloadedQuery(FilmListQuery, preloadedQuery);
  if (query.allFilms == null || query.allFilms.films == null) return null;

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-center text-3xl font-semibold mb-5">All Films</h1>

      <div className="grid grid-cols-3 gap-3">
        {query.allFilms.films.map((film) => {
          if (film == null) return null;
          return (
            <div
              key={film.id}
              className="rounded-md h-32 bg-gray-700 text-white"
            >
              <Link href={`/film/${film.id}`}>
                <a className="hover:underline">
                  <h2 className="text-center mt-3">{film.title}</h2>
                </a>
              </Link>
              <p className="text-sm p-2 truncate text-gray-200">
                {film.openingCrawl}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default withRelay(FilmList, FilmListQuery, {
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async () => {
    const { createServerEnvironment } = await import(
      'lib/server/relay_server_environment'
    );

    return createServerEnvironment();
  },
});
