"use client";

import PostCard from "@/components/post-card";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { SearchIcon } from "lucide-react";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Pagination,
  Configure,
} from 'react-instantsearch';

type PostHit = {
  objectID: string; 
  title: string;
  caption: string;
  type: string;
  author: string;
  authorId: string;
  path: string;
  images: string[];
  lastmodified?: number;
}

const searchClient = algoliasearch(`${process.env.NEXT_PUBLIC_ALGOLIA_APP_ID}`, `${process.env.NEXT_PUBLIC_ALGOLIA_API_KEY}`);

function Hit({ hit }: { hit: PostHit }) {
  const post = {
    id: hit.objectID,
    title: hit.title,
    author: hit.author,
    authorId: hit.authorId,
    type: hit.type,
    caption: hit.caption,
    images: hit.images,
  }

  return (
    <PostCard post={post} />
  );
}

export default function AlgoliaSearch() {
  const BigSearchIcon = () => (
    <SearchIcon className="w-6 h-6" />
  );

  return (
    <>
      <InstantSearch searchClient={searchClient} indexName="posts_index" insights>
        <Configure hitsPerPage={9} />
        <div className="flex flex-col gap-3 w-full max-w-[1024px] mx-auto">
          <Card className=" gap-3 text-sm ">
            <CardContent>
              <SearchBox
                placeholder="Search for posts..."
                submitIconComponent={BigSearchIcon}
                classNames={{
                  form: 'flex gap-2',
                  input: 'border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-blue-500',
                  submit: '',
                  reset: 'hidden',
                  loadingIndicator: 'hidden',
                }}
              />
            </CardContent>
          </Card>
          <Hits
            hitComponent={Hit}
            classNames={{
              list: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3',
            }}
          />
          <Pagination
            classNames={{
              list: 'flex flex-row justify-center items-center gap-1',
              item: 'text-sm hover:cursor-pointer',
              link: 'block px-3 py-1',
              pageItem:
                'border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200',
              selectedItem: 'bg-gray-200 font-semibold bg-white hover:bg-white',
              firstPageItem:
                ' rounded-md hover:bg-gray-100 transition-colors duration-200',
              previousPageItem:
                ' rounded-md hover:bg-gray-100 transition-colors duration-200',
              nextPageItem:
                ' rounded-md hover:bg-gray-100 transition-colors duration-200',
              lastPageItem:
                ' rounded-md hover:bg-gray-100 transition-colors duration-200',
            }}
          />
        </div>
      </InstantSearch >
    </>
  );
}
