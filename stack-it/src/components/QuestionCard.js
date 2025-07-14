"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { MessageSquare, ChevronUp, ChevronDown } from "lucide-react";
import { questionOperationUrl } from "@/lib/API";
import { useUserStore } from "@/stores/userStores";
import { toast } from "sonner";
import axios from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "./ui/badge";

export default function QuestionCard({ question, onVoteChange }) {
  const router = useRouter();
  const { user, isLoggedIn } = useUserStore();

  const handleCardClick = useCallback(() => {
    if (isLoggedIn) {
      if (question) {
        router.push(`/screens/question/${question.id}`);
      }
    } else {
      toast.info(
        "Looks like you haven't logged in yet. Please log in first to see answers..."
      );
    }
  }, [question?.id, router, isLoggedIn]);

  if (!question) return null;

  const handleVote = async (type, e) => {
    e.stopPropagation();
    if (!isLoggedIn) return toast.info("You must be logged in to vote.");

    try {
      await axios.post(
        `${questionOperationUrl}${question.id}/${type}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      onVoteChange?.();
    } catch (err) {
      console.error("Vote error:", err);
      toast.error("Something went wrong while voting.");
    }
  };

  const userId = user?._id;
  const hasUpvoted = question.upvotes?.includes(userId);
  const hasDownvoted = question.downvotes?.includes(userId);

  const timeAgo = question.timeAgo
    ? formatDistanceToNow(new Date(question.timeAgo), { addSuffix: true })
    : "";

  return (
    <TooltipProvider>
      <Card
        onClick={handleCardClick}
        className="cursor-pointer w-full bg-card text-card-foreground p-4 sm:p-6 rounded-lg border border-border flex flex-row gap-4 transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 hover:scale-[1.01]"
      >
        <div className="flex flex-col items-center text-center w-16 flex-shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 transition-colors ${
                  hasUpvoted
                    ? "text-green-500"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={(e) => handleVote("upvote", e)}
                disabled={hasUpvoted}
              >
                <ChevronUp className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {hasUpvoted ? "Already upvoted" : "Upvote this question"}
            </TooltipContent>
          </Tooltip>

          <span className="text-xl font-bold text-foreground my-1">
            {question.upvotesCount || question.votes || 0}
          </span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 transition-colors ${
                  hasDownvoted
                    ? "text-red-500"
                    : "text-muted-foreground hover:text-destructive"
                }`}
                onClick={(e) => handleVote("downvote", e)}
                disabled={hasDownvoted}
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {hasDownvoted ? "Already downvoted" : "Downvote this question"}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 hover:text-primary/90 transition-colors duration-200">
            {question.title}
          </h2>

          <div
            className="text-muted-foreground text-sm mb-3 line-clamp-2 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: question.htmlContent || "" }}
          />

          {Array.isArray(question.tags) && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {question.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-x-4">
              <div className="flex items-center gap-x-1">
                <MessageSquare size={14} />
                <span>
                  {question.replyCount || question.answers || 0} answers
                </span>
              </div>
            </div>
            <div className="mt-2 sm:mt-0">
              <span>
                Asked by{" "}
                <span className="text-primary/90 hover:underline cursor-pointer">
                  {question.userId?.name || question.author}
                </span>{" "}
                {timeAgo}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
}
