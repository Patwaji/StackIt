"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, ChevronsUpDown } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const ALL_TAGS = [
    "javascript", "react", "nextjs", "typescript", "python", "css", "html",
    "nodejs", "java", "c++", "c#", "php", "ruby", "go", "swift", "kotlin",
    "sql", "mysql", "postgresql", "mongodb", "firebase", "docker", "git",
    "tailwindcss", "api", "graphql", "rest", "aws", "azure", "google-cloud",
];

const TagInput = ({ tags, setTags }) => {
    const [open, setOpen] = useState(false);
    const availableTags = ALL_TAGS.filter(tag => !tags.includes(tag));

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSelectTag = (tag) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
        }
        setOpen(false);
    };

    return (
        <div className="grid gap-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex flex-wrap items-center gap-2 rounded-md border border-input p-2 min-h-[40px]">
                {tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-accent text-accent-foreground rounded-full px-2 py-1 text-sm">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="rounded-full hover:bg-destructive/20">
                            <X className="h-4 w-4" />
                        </button>
                    </span>
                ))}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="flex-1 justify-between min-w-[150px]"
                        >
                            {tags.length > 0 ? "Add another tag..." : "Select tags..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                            <CommandInput placeholder="Search for a tag..." />
                            <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup>
                                    {availableTags.map((tag) => (
                                        <CommandItem
                                            key={tag}
                                            value={tag}
                                            onSelect={() => handleSelectTag(tag)}
                                        >
                                            {tag}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            <p className="text-sm text-muted-foreground">
                Add up to 5 tags to describe what your question is about.
            </p>
        </div>
    );
};

export default function AskQuestionPage() {
    const [tags, setTags] = useState([]);

    return (
        <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <h1 className="text-3xl font-bold">Ask a Public Question</h1>
                </div>
                <form className="grid gap-6 p-6 bg-card rounded-lg border">
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-lg font-semibold">Title</Label>
                        <p className="text-sm text-muted-foreground">
                            Be specific and imagine you’re asking a question to another person.
                        </p>
                        <Input id="title" placeholder="e.g. How do I center a div in CSS?" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="body" className="text-lg font-semibold">Body</Label>
                        <p className="text-sm text-muted-foreground">
                            Include all the information someone would need to answer your question.
                        </p>
                        <Textarea id="body" placeholder="Type your question details here." rows={10} />
                    </div>
                    <TagInput tags={tags} setTags={setTags} />
                    <Button type="submit" className="w-40">Post Your Question</Button>
                </form>
            </div>
        </div>
    );
}
