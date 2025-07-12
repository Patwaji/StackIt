"use client";

import QuestionCard from "@/components/QuestionCard";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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

export default function HomePage() {
  const [filter, setFilter] = useState("Newest");
  // Simulate user authentication state. In a real app, this would come from an auth context.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const router = useRouter();

  // Mock data for display with all questions restored
  const mockQuestions = [
    {
      id: 1,
      title: "How to center a div in CSS?",
      excerpt:
          "I've been trying to center a div both horizontally and vertically for ages. I've tried margin: auto, flexbox, and grid, but what is the most reliable and modern method...",
      tags: ["css", "flexbox", "layout"],
      votes: 125,
      answers: 5,
      author: "JaneDoe",
      timestamp: "2 hours ago",
      views: "2.1k",
    },
    {
      id: 2,
      title:
          "What is the difference between let, const, and var in JavaScript?",
      excerpt:
          "I'm new to ES6 and I'm confused about the new variable declarations. When should I use let over const? And is var ever useful anymore? Looking for a clear explanation.",
      tags: ["javascript", "es6", "variables"],
      votes: 98,
      answers: 8,
      author: "JohnDev",
      timestamp: "5 hours ago",
      views: "3.4k",
    },
    {
      id: 3,
      title: "How to fetch data in React with hooks?",
      excerpt:
          "What is the best practice for fetching data from an API in a React functional component? I'm using the useEffect and useState hooks but I'm worried about infinite loops.",
      tags: ["react", "hooks", "api", "fetch"],
      votes: 210,
      answers: 12,
      author: "ReactFan",
      timestamp: "1 day ago",
      views: "5.8k",
    },
    {
      id: 4,
      title: "Best way to manage state in a large Next.js application?",
      excerpt:
          "Our Next.js app is growing and prop drilling is becoming a nightmare. We're considering Redux, Zustand, and React Context. What are the pros and cons of each for a large-scale project?",
      tags: ["nextjs", "react", "state-management"],
      votes: 77,
      answers: 4,
      author: "ScaleUp",
      timestamp: "3 days ago",
      views: "1.9k",
    },
  ];

  const filters = ["Newest", "Most Votes", "Most Answers", "Unanswered"];

  const handleAskQuestionClick = () => {
    if (isLoggedIn) {
      router.push("/screens/ask-question");
    } else {
      setShowLoginAlert(true);
    }
  };

  return (
      <>
        <div className="font-sans">
          <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                All Questions
              </h1>
              <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                {/* This button now triggers a function to check login status */}
                <Button onClick={handleAskQuestionClick}>
                  Ask Question
                </Button>
              </div>
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

            <div className="space-y-4">
              {mockQuestions.map((q) => (
                  <QuestionCard key={q.id} question={q} />
              ))}
            </div>
          </main>
        </div>

        <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Registration Required</AlertDialogTitle>
              <AlertDialogDescription>
                You need to create an account or log in before you can ask a question.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => router.push('/screens/register')}>
                Continue to Register
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
  );
}
