'use client';
import PostCard from "@/components/post-card";
import { SkeletonCard } from "@/components/skeleton-card";
import { useEffect, useState } from "react";
import { Hits, useInstantSearch } from "react-instantsearch";

type PostHit = {
  objectID: string;
  title: string;
  caption: string;
  type: string;
  author: string;
  authorId: string;
  path: string;
  images: {
    id: string,
    name: string,
    url: string,
  }[];
  lastmodified?: number;
}

function Hit({ hit }: { hit: PostHit }) {
  const post = {
    id: hit.objectID,
    title: hit.title,
    author: hit.author,
    authorId: hit.authorId,
    type: hit.type,
    caption: hit.caption,
    imagePath: hit.images[0].url,
  }

  return (
    <PostCard post={post} />
  );
}

export default function Result() {
  const { status, refresh } = useInstantSearch();
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    // Refresh algolia hits when the flag is set to true
    const shouldRefresh = localStorage.getItem('shouldRefreshPostHits') === 'true';

    if (shouldRefresh) {
      const timeout = setTimeout(() => {
        refresh();
        localStorage.setItem('shouldRefreshPostHits', 'false');
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [refresh]);

  useEffect(() => {
    if (status === 'loading' || status === 'stalled') {
      setShowSkeleton(true);
    } else {
      // Add a short delay to smooth transitions and avoid flickering
      const timeout = setTimeout(() => setShowSkeleton(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [status]);

  if (showSkeleton) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <Hits
      hitComponent={Hit}
      classNames={{
        list: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3',
      }}
    />
  )
}

