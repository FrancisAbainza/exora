import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { getPostById } from "@/data/posts";
import Image from "next/image";
import Link from "next/link";

export default async function Project({ params }: { params: Promise<{ projectId: string }> }) {
  const paramsValue = await params;
  const postData = await getPostById(paramsValue?.projectId);

  return (
    <Card className="w-full max-w-[554px] mx-auto">
      <CardHeader>
        <Carousel className="w-full">
          <CarouselContent>
            {postData?.images.map((imageUrl: string, index: number) => (
              <CarouselItem key={index} className="relative w-full h-[300px]">
                <Image src={imageUrl} alt={`${postData.title} image`} fill priority className="object-cover" />
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
          <Link href={postData?.link} target="_blank">Go to resource</Link>
        </Button>
      </CardFooter>
    </Card>

  );
}