import { useRouter } from "next/navigation";
import { useCallback } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  MessageSquare,
  Eye,
  ChevronUp,
  ChevronDown,
  Badge,
} from "lucide-react";

export default function QuestionCard({ question }) {
  const router = useRouter();

  const handleCardClick = useCallback(() => {
    router.push(`/screens/question/${question.id}`);
  }, [question.id, router]);

  if (!question) return null;



  return (
    <Card
      onClick={handleCardClick}
      className="cursor-pointer w-full bg-card text-card-foreground p-4 sm:p-6 rounded-lg border border-border flex flex-row gap-4 transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 hover:scale-[1.01]"
    >
      <div className="flex flex-col items-center text-center w-16 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
        <span className="text-xl font-bold text-foreground my-1">
          {question.votes}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 hover:text-primary/90 transition-colors duration-200">
          {question.title}
        </h2>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {question.excerpt}
        </p>
        <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-x-4">
            <div className="flex items-center gap-x-1">
              <MessageSquare size={14} />
              <span>{question.answers} answers</span>
            </div>
            <div className="flex items-center gap-x-1">
              <Eye size={14} />
              <span>{question.views} views</span>
            </div>
          </div>
          <div className="mt-2 sm:mt-0">
            <span>
              Asked by{" "}
              <span className="text-primary/90 hover:underline cursor-pointer">
                {question.author}
              </span>{" "}
              {question.timeAgo}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
