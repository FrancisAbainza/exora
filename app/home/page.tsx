'use client';

import { Configure, Pagination, SearchBox } from "react-instantsearch";
import AlgoliaSearch from "../../components/algolia-search";
import { Card, CardContent } from "@/components/ui/card";
import Result from "./result";
import { SearchIcon } from "lucide-react";

const BigSearchIcon = () => (
  <SearchIcon className="w-6 h-6" />
);

export default function Home() {
  return (
    <AlgoliaSearch
      indexName="posts_index"
      insights
    >
      <Configure hitsPerPage={9} />
      <div className="flex flex-col gap-3 w-full h-full max-w-[1024px] mx-auto">
        <Card className="gap-3 text-sm">
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
        <Result />
        <Pagination
          className="mt-auto"
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
    </AlgoliaSearch>
  );
}