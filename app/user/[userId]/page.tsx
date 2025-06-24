import PostCard from "@/components/post-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getPostsByAuthorId } from "@/data/posts";
import { getUserById } from "@/data/users";
import Image from "next/image";

export default async function User({ params }: { params: Promise<{ userId: string }> }) {
  const paramsValue = await params;
  const userData = await getUserById(paramsValue.userId);
  const userPosts = await getPostsByAuthorId(paramsValue.userId);

  return (
    <div className="w-full max-w-[1024px] mx-auto">
      <Card>
        <CardContent className="flex flex-col items-center gap-3">
          <Avatar className="w-[100px] h-[100px]">
            {!!userData?.photoURL && (
              <Image src={`${userData.photoURL}`} alt="profile image" width={100} height={100} />
            )}
            <AvatarFallback><h4>{userData?.displayName[0].toUpperCase()}</h4></AvatarFallback>
          </Avatar>
          <h4 className="font-bold">{userData?.displayName}</h4>
          {!!userData?.bio && (
            <p>{userData?.bio}</p>
          )}
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-3 mt-3 sm:grid-cols-2 lg:grid-cols-3">
        {userPosts.map((post) => {
          const postData = {
            id: post.id,
            title: post.title,
            author: post.author,
            authorId: post.authorId,
            type: post.type,
            caption: post.caption,
            images: post.images,
          }

          return <PostCard key={post.id} post={postData} />
        })}
      </div>
    </div>
  );
}