import React from "react";
import {
  MessageSquare,
  ThumbsUp,
  ChevronUp,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

export default function QuestionCard({ question }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700 flex space-x-4">
      <div className="flex flex-col items-center text-center w-16 flex-shrink-0">
        <button className="text-gray-400 hover:text-green-500 dark:hover:text-green-400">
          <ChevronUp size={24} />
        </button>
        <span className="text-xl font-bold text-gray-800 dark:text-gray-100 my-1">
          {question.votes}
        </span>
        <button className="text-gray-400 hover:text-red-500 dark:hover:text-red-400">
          <ChevronDown size={24} />
        </button>
      </div>

      <div className="flex-1">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
          <a
            href="#"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            {question.title}
          </a>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {question.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {question.tags.map((tag) => (
            <a
              href="#"
              key={tag}
              className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900"
            >
              {tag}
            </a>
          ))}
        </div>

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
            <span>
              Asked by{" "}
              <a href="#" className="text-blue-600 dark:text-blue-400">
                {question.author}
              </a>{" "}
              {question.timestamp}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
