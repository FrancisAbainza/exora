import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Eye } from "lucide-react";

type PostCardType = {
  id: string;
  title: string;
  author: string;
  authorId: string;
  caption: string;
  type: string;
  images: string[];
}

export default function PostCard({ post }: { post: PostCardType }) {
  const { id, title, author, authorId, caption, type, images } = post;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          <Link href={`/project/${id}`} className="hover:underline">
            {title}
          </Link>
        </CardTitle>
        <CardDescription>
          <Link href={`user/${authorId}`} className="hover:underline">
            {author}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="relative flex flex-col flex-1 gap-3 text-sm">
        <p>{caption}</p>
        <Badge variant="outline">{type}</Badge>
        <div className="relative w-full h-[200px] mt-auto">
          <Image src={images[0]} alt={title} fill sizes="100%" priority className="object-cover" />
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/project/${id}`} className="hover:bg-accent p-1 rounded-md" title="View Project">
          <Eye />
        </Link>
      </CardFooter>
    </Card>
  );
}