"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronUp, ChevronDown } from "lucide-react";

// --- Mock Data (now an array of questions) ---
// In a real application, this data would come from a database or API.
const mockQuestions = [
    {
        id: 1,
        title: "How to center a div in CSS?",
        body: "I've been trying to center a div both horizontally and vertically for ages. I've tried `margin: auto`, flexbox, and grid, but what is the most reliable and modern method for achieving this? I'm looking for a solution that is both robust and has good browser support. Code examples would be greatly appreciated!",
        tags: ["css", "flexbox", "layout"],
        votes: 125,
        author: {
            name: "JaneDoe",
            avatarUrl: "https://github.com/shadcn.png",
        },
        timestamp: "2 hours ago",
        answers: [
            { id: 101, body: "Flexbox is definitely the way to go for modern layouts. You can use `display: flex;`, `justify-content: center;`, and `align-items: center;` on the parent container. It's clean and widely supported.", votes: 42, author: { name: "ChrisFlex", avatarUrl: "https://github.com/shadcn.png" }, timestamp: "1 hour ago" },
            { id: 102, body: "Another great option is CSS Grid. For the parent element, you can use `display: grid;` and `place-items: center;`. This is arguably even simpler than flexbox for true centering.", votes: 28, author: { name: "GridMaster", avatarUrl: "https://github.com/shadcn.png" }, timestamp: "45 minutes ago" },
        ]
    },
    {
        id: 2,
        title: "What is the difference between `let`, `const`, and `var` in JavaScript?",
        body: "I'm new to ES6 and I'm confused about the new variable declarations. When should I use `let` over `const`? And is `var` ever useful anymore? Looking for a clear explanation of the differences in scope and hoisting.",
        tags: ["javascript", "es6", "variables"],
        votes: 98,
        author: {
            name: "JohnDev",
            avatarUrl: "https://github.com/shadcn.png",
        },
        timestamp: "5 hours ago",
        answers: [
            { id: 201, body: "`var` is function-scoped and hoisted, while `let` and `const` are block-scoped and are not hoisted in the same way, which helps prevent common bugs. Prefer `const` by default and use `let` only when you need to reassign the variable.", votes: 55, author: { name: "ES6Fan", avatarUrl: "https://github.com/shadcn.png" }, timestamp: "4 hours ago" },
        ]
    }
];


// --- Sub-components for the Question Page ---

const VoteControl = ({ votes }) => (
    <div className="flex flex-col items-center text-center w-12 flex-shrink-0">
        <Button variant="ghost" size="icon">
            <ChevronUp className="h-6 w-6" />
        </Button>
        <span className="text-xl font-bold text-foreground my-1">{votes}</span>
        <Button variant="ghost" size="icon">
            <ChevronDown className="h-6 w-6" />
        </Button>
    </div>
);

const UserInfo = ({ author, timestamp }) => (
    <div className="mt-4 flex items-center gap-2 text-sm">
        <Avatar className="h-8 w-8">
            <AvatarImage src={author.avatarUrl} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
            <div className="font-medium text-primary">{author.name}</div>
            <div className="text-muted-foreground">asked {timestamp}</div>
        </div>
    </div>
);

// --- Main Question Page Component ---
// The component now receives `params` from Next.js to get the dynamic ID from the URL.
export default function QuestionPage({ params }) {
    // Find the specific question from our mock data using the ID from the URL.
    // In a real app, you would use `params.id` to fetch data from an API.
    const questionDetails = mockQuestions.find(q => q.id.toString() === params.id);

    // If no question is found for the given ID, display a message.
    if (!questionDetails) {
        return (
            <div className="container mx-auto max-w-4xl p-8 text-center">
                <h1 className="text-2xl font-bold">Question Not Found</h1>
                <p className="text-muted-foreground">Sorry, we couldn't find the question you're looking for.</p>
                <Button asChild className="mt-4">
                    <Link href="/">Return to Homepage</Link>
                </Button>
            </div>
        );
    }

    const { title, body, tags, votes, author, timestamp, answers } = questionDetails;

    return (
        <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
            {/* Question Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
                <Separator />
                <div className="flex gap-4 py-6">
                    <VoteControl votes={votes} />
                    <div className="flex-1">
                        <p className="text-foreground/90 leading-relaxed">{body}</p>
                        <div className="flex flex-wrap gap-2 my-4">
                            {tags.map(tag => (
                                <Link href="#" key={tag} className="px-2.5 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full hover:bg-accent/80">
                                    {tag}
                                </Link>
                            ))}
                        </div>
                        <UserInfo author={author} timestamp={timestamp} />
                    </div>
                </div>
            </div>

            {/* Answers Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">{answers.length} Answers</h2>
                <div className="space-y-8">
                    {answers.map(answer => (
                        <div key={answer.id}>
                            <Separator />
                            <div className="flex gap-4 py-6">
                                <VoteControl votes={answer.votes} />
                                <div className="flex-1">
                                    <p className="text-foreground/90 leading-relaxed">{answer.body}</p>
                                    <UserInfo author={answer.author} timestamp={answer.timestamp} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Post Answer Section */}
            <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Your Answer</h2>
                <form>
                    <div className="grid w-full gap-2">
                        <Textarea placeholder="Type your answer here." rows={8} />
                        <Button className="w-40">Post Your Answer</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
