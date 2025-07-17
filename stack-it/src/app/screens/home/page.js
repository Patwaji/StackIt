"use client";

import QuestionCard from "@/components/QuestionCard"; // Import QuestionCardSkeleton
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import debounce from "lodash.debounce";
import { FilterIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";
import { QuestionCardSkeleton } from "@/components/skeleton/question-card-skeleton";

export default function HomePage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("newest");
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [suggestedTags, setSuggestedTags] = useState([]);

  const router = useRouter();
  const { isLoggedIn } = useUserStore();

  const availableTags = [
    "JavaScript",
    "Python",
    "Java",
    "C#",
    "C++",
    "HTML",
    "CSS",
    "React",
    "Node.js",
    "MongoDB",
    "SQL",
    "PHP",
    "Ruby",
    "Go",
    "TypeScript",
    "Swift",
    "Kotlin",
    "Vue.js",
    "Angular",
    "Next.js",
    "Express.js",
    "NestJS",
    "GraphQL",
    "REST API",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GCP",
    "Algorithms",
    "Data Structures",
    "Frontend",
    "Backend",
    "Fullstack",
    "Mobile Development",
    "Web Development",
    "Database",
    "Cybersecurity",
    "DevOps",
    "Machine Learning",
    "Artificial Intelligence",
  ];

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const tagsQuery =
        selectedTags.length > 0 ? `&tags=${selectedTags.join(",")}` : "";
      const res = await fetch(
        `${getAllQuestionUrl}?page=${page}&search=${searchTerm}&sort=${filter}${tagsQuery}`
      );
      const data = await res.json();
      setQuestions(data.questions || []);
      setTotalPages(Math.ceil(data.total / data.pageSize));
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, filter, selectedTags]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setPage(1);
      setSearchTerm(value);
    }, 500),
    []
  );

  const handleAskQuestionClick = () => {
    if (isLoggedIn) router.push("/screens/post-question");
    else setShowLoginAlert(true);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setTagInput(value);
    if (value.length > 0) {
      const filteredSuggestions = availableTags.filter(
        (tag) =>
          tag.toLowerCase().includes(value.toLowerCase()) &&
          !selectedTags.includes(tag)
      );
      setSuggestedTags(filteredSuggestions);
    } else {
      setSuggestedTags([]);
    }
  };

  const handleAddTag = (tagToAdd = tagInput) => {
    const trimmedTag = tagToAdd.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags((prev) => [...prev, trimmedTag]);
      setTagInput("");
      setSuggestedTags([]);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const applyTagFilters = () => {
    setPage(1);
    fetchQuestions();
    setShowFilterSheet(false);
  };

  const filters = [
    { label: "All", value: "all" },
    { label: "Most Upvoted", value: "upvotes" },
    { label: "Most Replied", value: "replies" },
    { label: "Newest", value: "newest" },
  ];

  return (
    <>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-row justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            All Questions
          </h1>
          <Button onClick={handleAskQuestionClick}>Ask Question</Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search questions..."
            onChange={handleSearchChange}
            className="sm:max-w-sm"
          />
          <Tabs
            defaultValue={filter}
            value={filter}
            onValueChange={(val) => {
              setFilter(val);
              setPage(1);
            }}
            className="flex-1"
          >
            <TabsList className="grid w-full grid-cols-4">
              {filters.map((f) => (
                <TabsTrigger key={f.value} value={f.value}>
                  {f.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilterSheet(true)}
            className="flex-shrink-0"
          >
            <FilterIcon className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <QuestionCardSkeleton key={index} />
            ))}
          </div>
        ) : questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((q) => (
              <QuestionCard
                key={q._id}
                question={{
                  id: q._id,
                  title: q.title,
                  htmlContent: q.htmlContent,
                  tags: q.tags, // Ensure tags are passed
                  votes: q.upvotesCount || 0,
                  answers: q.replyCount || 0,
                  views: 0,
                  author: q.user?.name || "Unknown",
                  timeAgo: q.createdAt,
                  upvotes: q.upvotes,
                  downvotes: q.downvotes,
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
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        )}
      </main>

      <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to login before posting a question.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/screens/register")}>
              Register
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={showFilterSheet} onOpenChange={setShowFilterSheet}>
        <SheetContent side="right" className="flex flex-col px-5">
          <SheetHeader>
            <SheetTitle>Filter by Tags</SheetTitle>
            <SheetDescription>
              Type to search or add new tags. Click on a suggested tag to add
              it.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 flex-grow overflow-y-auto">
            <div className="relative mb-4">
              <Input
                placeholder="Search or add tags (e.g., javascript)"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddTag();
                  }
                }}
              />
              {suggestedTags.length > 0 && tagInput.length > 0 && (
                <div className="absolute z-10 bg-background border border-border mt-1 rounded-md shadow-lg max-h-40 overflow-y-auto w-full">
                  {suggestedTags.map((tag) => (
                    <Button
                      key={tag}
                      variant="ghost"
                      className="w-full justify-start px-4 py-2 hover:bg-muted"
                      onClick={() => handleAddTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={() => handleAddTag()}
              className="w-full mb-4"
              disabled={!tagInput.trim()}
            >
              Add New Tag
            </Button>

            <Button
              variant="outline"
              onClick={() => setSelectedTags([])}
              className="w-full mb-4"
              disabled={selectedTags.length === 0}
            >
              Clear All Tags
            </Button>

            <h3 className="text-sm font-medium mb-2">Selected Tags:</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="pr-1">
                  {tag}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-4 w-4"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {selectedTags.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No tags selected.
                </p>
              )}
            </div>
          </div>
          <SheetFooter className="flex-shrink-0 ">
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button onClick={applyTagFilters}>Apply Filters</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
