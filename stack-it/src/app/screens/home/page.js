"use client";

import QuestionCard from "@/components/QuestionCard";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getAllQuestionUrl } from "@/lib/API";
import { useUserStore } from "@/stores/userStores";

export default function HomePage() {
  const [filter, setFilter] = useState("Newest");
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { isLoggedIn } = useUserStore();

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${getAllQuestionUrl}?page=${page}&search=${searchTerm}`
      );
      const data = await res.json();
      setQuestions(data.questions || []);
      setTotalPages(Math.ceil(data.total / data.pageSize));
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const filters = ["Newest", "Most Votes", "Most Answers", "Unanswered"];

  const handleAskQuestionClick = () => {
    if (isLoggedIn) router.push("/screens/post-question");
    else setShowLoginAlert(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchQuestions();
  };

  return (
    <>
      <div className="font-sans">
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex flex-row justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              All Questions
            </h1>
            <Button onClick={handleAskQuestionClick} className="">
              Ask Question
            </Button>
          </div>

          <form onSubmit={handleSearch} className="mb-6 max-w-md">
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          {loading ? (
            <p className="text-muted-foreground text-center">Loading...</p>
          ) : questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((q) => (
                <QuestionCard
                  key={q._id}
                  question={{
                    id: q._id,
                    title: q.title,
                    htmlContent: q.htmlContent,
                    tags: [],
                    votes: q.upvotesCount || 0,
                    answers: q.replyCount || 0,
                    views: 0,
                    author: q.userId?.name || "Unknown",
                    timeAgo: new Date(q.createdAt).toLocaleString(),
                  }}
                  onVoteChange={fetchQuestions}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">
              No questions found.
            </p>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Next
              </Button>
            </div>
          )}
        </main>
      </div>

      <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Registration Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to create an account or log in before you can ask a
              question.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/screens/register")}>
              Continue to Register
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
