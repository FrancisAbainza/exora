import SettingsDropdown from "@/app/post/[postId]/settings-dropdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { getPostById } from "@/data/posts";
import pathToFirebaseURL from "@/util/pathToFirebaseURL";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Project({ params }: { params: Promise<{ postId: string }> }) {
  const paramsValue = await params;
  const post = await getPostById(paramsValue?.postId);

  if (!post) {
    notFound();
  }

  return (
    <Card className="w-full max-w-[554px] mx-auto">
      <CardHeader>
        <Carousel className="w-full">
          <CarouselContent>
            {post?.images.map((image, index) => (
              <CarouselItem key={index} className="relative w-full h-[300px]">
                <Image
                  src={pathToFirebaseURL(image.url)}
                  alt={`${post.title} image`}
                  fill
                  priority
                  sizes="100%"
                  className="object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 border-0 bg-background" />
          <CarouselNext className="right-0 border-0 bg-background" />
        </Carousel>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="mt-3">{post?.title}</CardTitle>
            <CardDescription>{post?.author}</CardDescription>
          </div>
          <SettingsDropdown authorId={post.authorId} postId={post.id} />
        </div>
      </CardHeader>
      <CardContent>
        <p>{post?.description}</p>
        <Badge variant="outline">{post?.type}</Badge>
      </CardContent>
      <CardFooter>
        <Button asChild>
          {post?.link && (
            <Link href={post?.link} target="_blank">Go to resource</Link>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}