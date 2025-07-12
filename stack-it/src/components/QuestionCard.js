import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, MessageSquare, Eye } from "lucide-react";

export default function QuestionCard({ question }) {
  if (!question) {
    return null;
  }

  return (
    <Link href={`/screens/question/${question.id}`} className="block">
      <Card className="w-full bg-card text-card-foreground p-4 sm:p-6 rounded-lg border border-border flex gap-4 transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 hover:scale-[1.01]">
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
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
            <Link
              href={`/question/${question.id}`}
              className="hover:text-primary/90 transition-colors duration-200"
            >
              {question.title}
            </Link>
          </h2>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {question.excerpt}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map((tag, index) => (
              <Link
                href="#"
                key={index}
                className="px-2.5 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full hover:bg-accent/80 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-x-4">
              <div className="flex items-center gap-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{question.answers} answers</span>
              </div>
              <div className="flex items-center gap-x-1">
                <Eye className="h-4 w-4" />
                <span>{question.views} views</span>
              </div>
            </div>
            <div className="mt-2 sm:mt-0">
              <span>
                Asked by{" "}
                <Link href="#" className="text-primary/90 hover:underline">
                  {question.author}
                </Link>{" "}
                {question.timeAgo}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
