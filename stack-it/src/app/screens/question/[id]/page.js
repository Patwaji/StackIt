"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import { ChevronUp, ChevronDown, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUserStore } from "@/stores/userStores";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  postAnswerUrl,
  questionOperationUrl,
  replyOperationUrl,
} from "@/lib/API";
import {
  QuestionCardSkeleton,
  AnswerFormSkeleton,
  ReplyCardSkeleton,
} from "@/components/skeleton/question-details-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuestionDetailPage() {
  const params = useParams();
  const { id } = params;

  const [question, setQuestion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAnswerContent, setNewAnswerContent] = useState("");
  const { user, isLoggedIn } = useUserStore();

  const fetchQuestionData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${questionOperationUrl}${id}`);
      setQuestion(data.question);
      setReplies(data.replies);
    } catch (error) {
      console.error("Failed to fetch question:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (questionId, type) => {
    try {
      await axios.post(
        `${questionOperationUrl}${questionId}/${type}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchQuestionData();
    } catch (err) {
      console.error("Failed to vote on question:", err);
    }
  };

  const handleReplyVote = async (replyId, type) => {
    try {
      await axios.post(
        `${replyOperationUrl}${replyId}/${type}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchQuestionData();
    } catch (error) {
      console.error(`Failed to ${type} reply:`, error);
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswerContent.trim()) return;

    try {
      await axios.post(
        postAnswerUrl,
        { text: newAnswerContent, questionId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setNewAnswerContent("");
      fetchQuestionData();
    } catch (error) {
      console.error("Failed to post answer:", error);
    }
  };

  useEffect(() => {
    fetchQuestionData();
  }, [id]);

  const userId = user?._id;
  const hasUpvotedQ = question?.upvotes?.includes(userId);
  const hasDownvotedQ = question?.downvotes?.includes(userId);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-10 w-40 mb-6" />
        <QuestionCardSkeleton />
        <AnswerFormSkeleton />
        <Skeleton className="h-6 w-1/3 mb-4 mt-10" />{" "}
        <div className="space-y-4">
          <ReplyCardSkeleton />
          <ReplyCardSkeleton />
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Question Not Found</h1>
        <p className="text-muted-foreground">
          The question you are looking for does not exist.
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button>Go back to questions</Button>
        </Link>
      </div>
    );
  }

  const timeAgo = question?.createdAt
    ? formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })
    : "";

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/" className="mb-6 inline-block">
        <Button variant="outline">← Back to Questions</Button>
      </Link>

      {/* Question Card */}
      <Card className="w-full bg-card text-card-foreground p-4 sm:p-6 border border-border rounded-lg flex flex-row gap-4 mb-8">
        <div className="flex flex-col items-center text-center w-16 flex-shrink-0 pt-2">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 transition-colors ${
              hasUpvotedQ
                ? "text-green-500"
                : "text-muted-foreground hover:text-primary"
            }`}
            onClick={() => handleVote(question._id, "upvote")}
            disabled={hasUpvotedQ}
          >
            <ChevronUp className="h-5 w-5" />
          </Button>

          <span className="text-lg font-bold my-1">
            {question.upvotes?.length || 0}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 transition-colors ${
              hasDownvotedQ
                ? "text-red-500"
                : "text-muted-foreground hover:text-destructive"
            }`}
            onClick={() => handleVote(question._id, "downvote")}
            disabled={hasDownvotedQ}
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
            {question.title}
          </h1>

          <div
            className="text-muted-foreground text-sm break-words overflow-hidden"
            dangerouslySetInnerHTML={{ __html: question.htmlContent }}
          />

          {Array.isArray(question.tags) && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex justify-between text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} />
              {replies.length} answers
            </div>
            <div>
              Asked by{" "}
              <span className="text-primary font-medium">
                {question.userId?.name}
              </span>{" "}
              {timeAgo}
            </div>
          </div>
        </div>
      </Card>

      {/* Answer Form */}
      <Card className="w-full bg-card text-card-foreground mb-6">
        <CardHeader>
          <CardTitle>Your Answer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnswerSubmit} className="space-y-4">
            <Label htmlFor="answer-content" className="sr-only">
              Your Answer
            </Label>
            <Textarea
              id="answer-content"
              placeholder="Type your answer here..."
              rows={5}
              value={newAnswerContent}
              onChange={(e) => setNewAnswerContent(e.target.value)}
            />
            <div className="flex justify-end">
              <Button type="submit">Post Your Answer</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Answer List */}
      <h2 className="text-xl font-bold mb-4 mt-10">{replies.length} Answers</h2>
      <div className="space-y-4">
        {replies.map((reply) => {
          const hasUpvoted = reply.upvotes?.includes(userId);
          const hasDownvoted = reply.downvotes?.includes(userId);

          return (
            <Card
              key={reply._id}
              className="w-full bg-card text-card-foreground p-4 sm:p-6 border border-border rounded-lg flex flex-row gap-4"
            >
              <div className="flex flex-col items-center text-center w-16 flex-shrink-0 pt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 transition-colors ${
                    hasUpvoted
                      ? "text-green-500"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => handleReplyVote(reply._id, "upvote")}
                  disabled={hasUpvoted}
                >
                  <ChevronUp className="h-5 w-5" />
                </Button>

                <span className="text-lg font-bold my-1">
                  {reply.upvotes?.length || 0}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 transition-colors ${
                    hasDownvoted
                      ? "text-red-500"
                      : "text-muted-foreground hover:text-destructive"
                  }`}
                  onClick={() => handleReplyVote(reply._id, "downvote")}
                  disabled={hasDownvoted}
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug text-muted-foreground break-words overflow-hidden">
                  {reply.text}
                </p>
                <div className="mt-2 text-xs text-muted-foreground text-right">
                  Answered by{" "}
                  <span className="text-primary font-medium">
                    {reply.userId?.name}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
