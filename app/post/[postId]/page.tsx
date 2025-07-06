import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { getPostById } from "@/data/posts";
import pathToFirebaseURL from "@/util/pathToFirebaseURL";
import Image from "next/image";
import Link from "next/link";

export default async function Project({ params }: { params: Promise<{ postId: string }> }) {
  const paramsValue = await params;
  const postData = await getPostById(paramsValue?.postId);

  return (
    <Card className="w-full max-w-[554px] mx-auto">
      <CardHeader>
        <Carousel className="w-full">
          <CarouselContent>
            {postData?.images.map((path: string, index: number) => (
              <CarouselItem key={index} className="relative w-full h-[300px]">
                <Image src={pathToFirebaseURL(path)} alt={`${postData.title} image`} fill priority className="object-cover" />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 border-0 bg-background" />
          <CarouselNext className="right-0 border-0 bg-background" />
        </Carousel>
        <CardTitle className="mt-3">{postData?.title}</CardTitle>
        <CardDescription>{postData?.author}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{postData?.description}</p>
        <Badge variant="outline">{postData?.type}</Badge>
      </CardContent>
      <CardFooter>
        <Button asChild>
          {postData?.link && (
            <Link href={postData?.link} target="_blank">Go to resource</Link>
          )}
        </Button>
      </CardFooter>
    </Card>

  );
}