"use client";

import QuestionCard from "@/components/QuestionCard";
import React, { useEffect, useState } from "react";
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

export default function HomePage() {
  const [filter, setFilter] = useState("Newest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const fetchQuestions = async () => {
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
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [page, searchTerm]);

  const filters = ["Newest", "Most Votes", "Most Answers", "Unanswered"];

  const handleAskQuestionClick = () => {
    if (isLoggedIn) router.push("/screens/post-question");
    else setShowLoginAlert(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // reset to first page
    fetchQuestions();
  };

  return (
    <>
      <div className="font-sans">
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              All Questions
            </h1>
            <Button onClick={handleAskQuestionClick} className="mt-3 sm:mt-0">
              Ask Question
            </Button>
          </div>

          <div className="flex items-center border-b border-border mb-6">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 sm:px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors ${
                  filter === f
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-input"
                }`}
              >
                {f}
              </button>
            ))}
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
                    tags: [], // Add tag logic if available
                    votes: q.upvotesCount || 0,
                    answers: q.replyCount || 0,
                    views: 0, // Replace with actual views if supported
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
