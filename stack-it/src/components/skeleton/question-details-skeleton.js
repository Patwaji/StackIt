import { Card, CardHeader, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const QuestionCardSkeleton = () => (
  <Card className="w-full bg-card text-card-foreground p-4 sm:p-6 border border-border rounded-lg flex flex-row gap-4 mb-8">
    <div className="flex flex-col items-center text-center w-16 flex-shrink-0 pt-2">
      <Skeleton className="h-8 w-8 rounded-md mb-2" />
      <Skeleton className="h-6 w-10 rounded-md my-1" />
      <Skeleton className="h-8 w-8 rounded-md" />
    </div>
    <div className="flex-1 min-w-0 space-y-3">
      <Skeleton className="h-7 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="flex justify-between text-xs pt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  </Card>
);

export const AnswerFormSkeleton = () => (
  <Card className="w-full bg-card text-card-foreground mb-6">
    <CardHeader>
      <Skeleton className="h-6 w-1/4" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ReplyCardSkeleton = () => (
  <Card className="w-full bg-card text-card-foreground p-4 sm:p-6 border border-border rounded-lg flex flex-row gap-4">
    <div className="flex flex-col items-center text-center w-16 flex-shrink-0 pt-2">
      <Skeleton className="h-8 w-8 rounded-md mb-2" />
      <Skeleton className="h-6 w-10 rounded-md my-1" />
      <Skeleton className="h-8 w-8 rounded-md" />
    </div>
    <div className="flex-1 min-w-0">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6 mt-2" />
      <div className="mt-2 text-right">
        <Skeleton className="h-4 w-32 ml-auto" />
      </div>
    </div>
  </Card>
);
