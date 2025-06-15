"use client";

import { InstantSearch, InstantSearchProps } from 'react-instantsearch';
import { liteClient as algoliasearch } from 'algoliasearch/lite';

type AlgoliaSearchProps = Omit<InstantSearchProps, 'searchClient'> & {
  children: React.ReactNode;
};

const searchClient = algoliasearch(`${process.env.NEXT_PUBLIC_ALGOLIA_APP_ID}`, `${process.env.NEXT_PUBLIC_ALGOLIA_API_KEY}`);

export default function AlgoliaSearch({ children, ...props }: AlgoliaSearchProps) {
  return (
    <>
      <InstantSearch searchClient={searchClient} {...props}>
        {children}
      </InstantSearch >
    </>
  );
}
