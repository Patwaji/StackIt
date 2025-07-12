"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import { ChevronUp, ChevronDown, MessageSquare, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  postAnswerUrl,
  questionOperationUrl,
  replyOperationUrl,
} from "@/lib/API";

export default function QuestionDetailPage() {
  const params = useParams();
  const { id } = params;

  const [question, setQuestion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAnswerContent, setNewAnswerContent] = useState("");

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

  useEffect(() => {
    fetchQuestionData();
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswerContent.trim()) return;

    try {
      await axios.post(
        `${postAnswerUrl}`,
        { text: newAnswerContent, questionId: id },
        {
          headers: {
            "Content-Type": "application/json",
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

  if (loading) {
    return <p className="text-center text-muted-foreground">Loading...</p>;
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

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/" className="mb-6 inline-block">
        <Button variant="outline">← Back to Questions</Button>
      </Link>

      <Card className="w-full bg-card text-card-foreground mb-8">
        <CardContent className="p-6 flex gap-6">
          <div className="flex flex-col items-center justify-start pt-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronUp className="h-5 w-5" />
            </Button>
            <span className="text-lg font-bold">
              {question.upvotes?.length || 0}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-bold leading-tight">
              {question.title}
            </h1>
            <div
              className="text-base text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: question.htmlContent }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-6 pt-0 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{replies.length} answers</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>0 views</span>
            </div>
          </div>
          <div className="text-right">
            Asked by{" "}
            <span className="font-medium text-primary">
              {question.userId?.name}
            </span>
          </div>
        </CardFooter>
      </Card>

      <Card className="w-full bg-card text-card-foreground mt-8">
        <CardHeader>
          <CardTitle>Your Answer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnswerSubmit} className="space-y-4">
            <div>
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
            </div>
            <div className="flex justify-end">
              <Button type="submit">Post Your Answer</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4 mt-10">{replies.length} Answers</h2>
      <div className="space-y-6">
        {replies.map((reply) => (
          <Card key={reply._id} className="w-full bg-card text-card-foreground">
            <CardContent className="p-6 flex gap-6">
              <div className="flex flex-col items-center justify-start pt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleReplyVote(reply._id, "upvote")}
                >
                  <ChevronUp className="h-5 w-5" />
                </Button>
                <span className="text-lg font-bold">
                  {reply.upvotes?.length || 0}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleReplyVote(reply._id, "downvote")}
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 space-y-4">
                <p className="text-base text-muted-foreground">{reply.text}</p>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-end p-6 pt-0 text-sm text-muted-foreground">
              <div className="text-right">
                Answered by{" "}
                <span className="font-medium text-primary">
                  {reply.userId?.name}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
