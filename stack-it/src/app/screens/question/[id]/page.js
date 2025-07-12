"use client";

import { use } from "react";
import { useState } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, MessageSquare, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { questions, answers } from "@/lib/mock-data";

export default function QuestionDetailPage({ params }) {
  const { id } = use(params);
  const question = questions.find((q) => q.id === id);
  const [questionAnswers, setQuestionAnswers] = useState(answers[id] || []);
  const [newAnswerContent, setNewAnswerContent] = useState("");

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

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (newAnswerContent.trim()) {
      const newAnswer = {
        id: `a${questionAnswers.length + 1}`,
        author: "Current User",
        timeAgo: "just now",
        votes: 0,
        content: newAnswerContent.trim(),
      };
      setQuestionAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
      setNewAnswerContent("");
    }
  };

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
            <span className="text-lg font-bold">{question.votes}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-bold leading-tight">
              {question.title}
            </h1>
            <p className="text-base text-muted-foreground">
              {question.fullQuestion}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-6 pt-0 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{question.answers} answers</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{question.views} views</span>
            </div>
          </div>
          <div className="text-right">
            Asked by{" "}
            <span className="font-medium text-primary">{question.author}</span>{" "}
            {question.timeAgo}
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
                className="w-full"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Post Your Answer</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4">
        {questionAnswers.length} Answers
      </h2>
      <div className="space-y-6">
        {questionAnswers.map((answer) => (
          <Card key={answer.id} className="w-full bg-card text-card-foreground">
            <CardContent className="p-6 flex gap-6">
              <div className="flex flex-col items-center justify-start pt-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronUp className="h-5 w-5" />
                </Button>
                <span className="text-lg font-bold">{answer.votes}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 space-y-4">
                <p className="text-base text-muted-foreground">
                  {answer.content}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-end p-6 pt-0 text-sm text-muted-foreground">
              <div className="text-right">
                Answered by{" "}
                <span className="font-medium text-primary">
                  {answer.author}
                </span>{" "}
                {answer.timeAgo}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
