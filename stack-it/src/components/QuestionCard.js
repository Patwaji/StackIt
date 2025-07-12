"use client";

import React from 'react';
import Link from 'next/link'; // Imported the Link component
import { MessageSquare, ThumbsUp, ChevronUp, ChevronDown } from 'lucide-react';

// The QuestionCard component is styled using your global theme variables.
// It receives a 'question' object as a prop to display its data.
export default function QuestionCard({ question }) {
  // A simple guard clause to prevent rendering errors if the question prop is missing.
  if (!question) {
    return null;
  }

  return (
      // Main card container with a more subtle hover effect.
      // The scale has been reduced from 1.02 to 1.01.
      <div className="bg-card text-card-foreground p-4 sm:p-6 rounded-lg border border-border flex gap-4 transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 hover:scale-[1.01]">

        {/* Vote Counter Section */}
        <div className="flex flex-col items-center text-center w-16 flex-shrink-0">
          {/* Upvote button uses a muted color, changing to the primary color on hover. */}
          <button className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronUp size={24} />
          </button>
          {/* Vote count uses the main foreground color for emphasis. */}
          <span className="text-xl font-bold text-foreground my-1">
          {question.votes}
        </span>
          {/* Downvote button uses a muted color, changing to the destructive color on hover. */}
          <button className="text-muted-foreground hover:text-destructive transition-colors">
            <ChevronDown size={24} />
          </button>
        </div>

        {/* Main Question Content */}
        <div className="flex-1 min-w-0">
          {/* Question title now uses the Link component. */}
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
            <Link
                href="#" // In a real app, this would be `/questions/${question.id}`
                className="hover:text-primary/90 transition-colors duration-200"
            >
              {question.title}
            </Link>
          </h2>
          {/* The excerpt uses a muted foreground color for secondary text. */}
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {question.excerpt}
          </p>

          {/* Tags now use the Link component. */}
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map((tag) => (
                <Link
                    href="#" // In a real app, this would be `/tags/${tag}`
                    key={tag}
                    className="px-2.5 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full hover:bg-accent/80 transition-colors"
                >
                  {tag}
                </Link>
            ))}
          </div>

          {/* Meta information at the bottom of the card. */}
          <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-x-4">
              <div className="flex items-center gap-x-1">
                <MessageSquare size={14} />
                <span>{question.answers} answers</span>
              </div>
              <div className="flex items-center gap-x-1">
                <ThumbsUp size={14} />
                <span>{question.views} views</span>
              </div>
            </div>
            <div className="mt-2 sm:mt-0">
            <span>
              Asked by{" "}
              {/* Author link now uses the Link component. */}
              <Link
                  href="#" // In a real app, this would be `/users/${question.author}`
                  className="text-primary/90 hover:underline"
              >
                {question.author}
              </Link>{" "}
              {question.timestamp}
            </span>
            </div>
          </div>
        </div>
      </div>
  );
}
