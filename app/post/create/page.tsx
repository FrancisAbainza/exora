import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NewPostForm from "./new-post-form";

export default function CreatePost() {
  return (
    <Card className="w-full max-w-[554px] mx-auto gap-3 text-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create Post</CardTitle>
      </CardHeader>
      <CardContent>
        <NewPostForm />
      </CardContent>
    </Card>
  );
}