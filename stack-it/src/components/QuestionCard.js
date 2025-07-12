"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { MessageSquare, Eye, ChevronUp, ChevronDown } from "lucide-react";
import { questionOperationUrl } from "@/lib/API";

export default function QuestionCard({ question, onVoteChange }) {
  const router = useRouter();

  if (!question) return null;

  const handleCardClick = useCallback(() => {
    router.push(`/screens/question/${question.id}`);
  }, [question.id, router]);

  const handleVote = async (type, e) => {
    e.stopPropagation(); // Prevent card navigation

    try {
      const res = await fetch(`${questionOperationUrl}${question.id}/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // if protected
        },
      });

      if (!res.ok) {
        throw new Error("Vote failed");
      }

      if (onVoteChange) onVoteChange(); // Refresh list if callback is passed
    } catch (err) {
      console.error(err);
    }
  };

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
          onClick={(e) => handleVote("upvote", e)}
          title="Upvote this question"
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
          onClick={(e) => handleVote("downvote", e)}
          title="Downvote this question"
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 hover:text-primary/90 transition-colors duration-200">
          {question.title}
        </h2>

        <div
          className="text-muted-foreground text-sm mb-3 line-clamp-2 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: question.htmlContent || "" }}
        />

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
