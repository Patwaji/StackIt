import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function QuestionCardSkeleton() {
  return (
    <Card className="w-full bg-card text-card-foreground p-4 sm:p-6 rounded-lg border border-border flex flex-row gap-4">
      <div className="flex flex-col items-center text-center w-16 flex-shrink-0">
        <Skeleton className="h-8 w-8 rounded-md mb-2" />
        <Skeleton className="h-6 w-10 rounded-md mb-2" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      <div className="flex-1 min-w-0">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-3" />
        <div className="flex flex-wrap gap-2 mb-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="flex justify-between items-center text-xs">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </Card>
  );
}
