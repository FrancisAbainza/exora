import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

export function SkeletonCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 w-full" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-full" />
        </CardDescription>
      </CardHeader>
      <CardContent className="relative flex flex-col flex-1 gap-3 text-sm">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
      </CardContent>
    </Card>
  )
}
