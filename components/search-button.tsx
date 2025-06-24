"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import OutlineBorder from "./outline-border"
import { SearchIcon } from "lucide-react"
import {
  SearchBox,
  Hits,
  useInstantSearch,
  Configure,
} from 'react-instantsearch';
import Image from "next/image";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Link from "next/link";
import AlgoliaSearch from "./algolia-search";

type UserHit = {
  objectID: string;
  displayName: string;
  path: string;
  photoURL?: string;
  lastmodified: number;
}

const BigSearchIcon = () => (
  <SearchIcon className="w-6 h-6" />
);

const HitsOnlyWhenQuery = () => {
  const { indexUiState } = useInstantSearch();
  return indexUiState.query
    ? <>
      <DropdownMenuSeparator />
      <Hits
        hitComponent={Hit}
        classNames={{
          list: 'flex flex-col',
        }}
      />
    </>
    : null;
}

function Hit({ hit }: { hit: UserHit }) {
  return (
    <Link href={`/user/${hit.objectID}`} className="flex flex-row items-center gap-3 hover:bg-accent p-3 rounded-md">
      <Avatar>
        {!!hit.photoURL && (
          <Image
            src={hit.photoURL}
            alt={hit.displayName}
            width={40}
            height={40}
          />
        )}
        <AvatarFallback>{hit.displayName[0].charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <p>{hit.displayName}</p>
    </Link>
  );
}

export default function SearchButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <OutlineBorder>
          <SearchIcon size={20} />
        </OutlineBorder>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-3 p-3 text-sm">
        <AlgoliaSearch
          indexName="users_index"
          insights
        >
          <Configure hitsPerPage={5} />
          <SearchBox
            placeholder="Search for user..."
            submitIconComponent={BigSearchIcon}
            classNames={{
              form: 'flex gap-2',
              input: 'border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-blue-500',
              submit: '',
              reset: 'hidden',
              loadingIndicator: 'hidden',
            }}
          />

          <HitsOnlyWhenQuery />
        </AlgoliaSearch>
    </DropdownMenuContent>
    </DropdownMenu >
  )
}