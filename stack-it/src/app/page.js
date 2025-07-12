'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, ChevronUp, ChevronDown, Sun, Moon } from 'lucide-react';

// Mock Data for Questions - In a real app, this would come from an API
const mockQuestions = [
  {
    id: 1,
    title: "How to center a div in CSS?",
    excerpt: "I've been trying to center a div both horizontally and vertically for ages. I've tried margin: auto, flexbox, and grid, but what is the most reliable and modern method...",
    tags: ["css", "flexbox", "layout"],
    votes: 125,
    answers: 5,
    author: "JaneDoe",
    timestamp: "2 hours ago",
    views: "2.1k"
  },
  {
    id: 2,
    title: "What is the difference between `let`, `const`, and `var` in JavaScript?",
    excerpt: "I'm new to ES6 and I'm confused about the new variable declarations. When should I use `let` over `const`? And is `var` ever useful anymore? Looking for a clear explanation.",
    tags: ["javascript", "es6", "variables"],
    votes: 98,
    answers: 8,
    author: "JohnDev",
    timestamp: "5 hours ago",
    views: "3.4k"
  },
  {
    id: 3,
    title: "How to fetch data in React with hooks?",
    excerpt: "What is the best practice for fetching data from an API in a React functional component? I'm using the useEffect and useState hooks but I'm worried about infinite loops.",
    tags: ["react", "hooks", "api", "fetch"],
    votes: 210,
    answers: 12,
    author: "ReactFan",
    timestamp: "1 day ago",
    views: "5.8k"
  },
  {
    id: 4,
    title: "Best way to manage state in a large Next.js application?",
    excerpt: "Our Next.js app is growing and prop drilling is becoming a nightmare. We're considering Redux, Zustand, and React Context. What are the pros and cons of each for a large-scale project?",
    tags: ["nextjs", "react", "state-management"],
    votes: 77,
    answers: 4,
    author: "ScaleUp",
    timestamp: "3 days ago",
    views: "1.9k"
  }
];

// --- Sub-components ---

// Question Card Component
const QuestionCard = ({ question }) => {
  return (
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700 flex space-x-4">
        {/* Vote Counter */}
        <div className="flex flex-col items-center text-center w-16 flex-shrink-0">
          <button className="text-gray-400 hover:text-green-500 dark:hover:text-green-400"><ChevronUp size={24} /></button>
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100 my-1">{question.votes}</span>
          <button className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"><ChevronDown size={24} /></button>
        </div>

        {/* Question Content */}
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              {question.title}
            </a>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {question.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map(tag => (
                <a href="#" key={tag} className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900">
                  {tag}
                </a>
            ))}
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <MessageSquare size={14} />
                <span>{question.answers} answers</span>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsUp size={14} />
                <span>{question.views} views</span>
              </div>
            </div>
            <div className="mt-2 sm:mt-0">
              <span>Asked by <a href="#" className="text-blue-600 dark:text-blue-400">{question.author}</a> {question.timestamp}</span>
            </div>
          </div>
        </div>
      </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [filter, setFilter] = useState('Newest');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved user preference in localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filters = ["Newest", "Most Votes", "Most Answers", "Unanswered"];

  return (
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans`}>
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">All Questions</h1>
            <div className="flex items-center space-x-4 mt-3 sm:mt-0">

              <a href="#" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Ask Question
              </a>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 mb-6">
            {filters.map(f => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 sm:px-4 py-2 text-sm font-medium -mb-px border-b-2 ${filter === f ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'}`}
                >
                  {f}
                </button>
            ))}
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {mockQuestions.map(q => (
                <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        </main>
      </div>
  );
}
