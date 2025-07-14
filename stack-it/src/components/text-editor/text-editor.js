"use client";

import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Link,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Check, // For Combobox item selection indicator
  ChevronsUpDown, // For Combobox trigger icon
  X, // For removing selected tags
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover, // Used for the Combobox
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command, // Used for the Combobox
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component
import { cn } from "@/lib/utils"; // Your utility for conditional classnames

import axios from "axios";
import { postQuestionUrl } from "@/lib/API";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function TextEditor() {
  const [questionTitle, setQuestionTitle] = useState("");
  const [content, setContent] = useState("");
  const [jsonOutput, setJsonOutput] = useState(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [openCombobox, setOpenCombobox] = useState(false); // State for combobox popover
  const editorRef = useRef(null);
  const selectionRef = useRef(null);
  const router = useRouter();

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

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleLinkInsert = () => {
    if (linkUrl && selectionRef.current) {
      editorRef.current?.focus();
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(selectionRef.current);
      const selectedText = selection.toString();
      if (selectedText) {
        const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style={{color: "blue"}}>${selectedText}</a>`;
        document.execCommand("insertHTML", false, linkHtml);
      }
      setLinkUrl("");
      setIsLinkDialogOpen(false);
      selectionRef.current = null;
    }
  };

  const parseContentToJson = () => {
    const editorContent = editorRef.current?.innerHTML || "";
    const textContent = editorRef.current?.textContent || "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = editorContent;

    const result = {
      plainText: textContent,
      htmlContent: editorContent,
      formatting: [],
      links: [],
      alignment: getAlignment(editorContent),
      wordCount: textContent
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length,
      characterCount: textContent.length,
    };

    const boldElements = tempDiv.querySelectorAll("b, strong");
    boldElements.forEach((el) => {
      result.formatting.push({
        type: "bold",
        text: el.textContent,
        position: getTextPosition(textContent, el.textContent),
      });
    });

    const italicElements = tempDiv.querySelectorAll("i, em");
    italicElements.forEach((el) => {
      result.formatting.push({
        type: "italic",
        text: el.textContent,
        position: getTextPosition(textContent, el.textContent),
      });
    });

    const underlineElements = tempDiv.querySelectorAll("u");
    underlineElements.forEach((el) => {
      result.formatting.push({
        type: "underline",
        text: el.textContent,
        position: getTextPosition(textContent, el.textContent),
      });
    });

    const linkElements = tempDiv.querySelectorAll("a");
    linkElements.forEach((el) => {
      result.links.push({
        text: el.textContent,
        url: el.href,
        target: el.target || "_self",
        position: getTextPosition(textContent, el.textContent),
      });
    });

    return result;
  };

  const getAlignment = (htmlContent) => {
    if (
      htmlContent.includes("text-align: center") ||
      htmlContent.includes('style="text-align:center"')
    ) {
      return "center";
    }
    if (
      htmlContent.includes("text-align: right") ||
      htmlContent.includes('style="text-align:right"')
    ) {
      return "right";
    }
    return "left";
  };

  const getTextPosition = (fullText, searchText) => {
    const index = fullText.indexOf(searchText);
    return index !== -1
      ? { start: index, end: index + searchText.length }
      : null;
  };

  const handleContentChange = () => {
    setContent(editorRef.current?.innerHTML || "");
  };

  const handleTagToggle = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleSubmit = async () => {
    if (!questionTitle.trim()) {
      toast.error("Please enter a title for your question.");
      return;
    }
    if (!content.trim()) {
      toast.error("Please enter some content for your question.");
      return;
    }
    if (selectedTags.length === 0) {
      toast.error("Please select at least one tag for your question.");
      return;
    }

    const jsonResult = parseContentToJson();
    setJsonOutput(jsonResult);

    const payload = {
      ...jsonResult,
      title: questionTitle.trim(),
      tags: selectedTags,
    };

    try {
      await axios.post(postQuestionUrl, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Question posted successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error posting question:", error);
      toast.error("Failed to post question. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ask a New Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="questionTitle">Question Title</Label>
            <Input
              id="questionTitle"
              type="text"
              placeholder="e.g., How to center a div in CSS?"
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-muted/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => executeCommand("bold")}
              className="h-8"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => executeCommand("italic")}
              className="h-8"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => executeCommand("underline")}
              className="h-8"
            >
              <Underline className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => executeCommand("justifyLeft")}
              className="h-8"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => executeCommand("justifyCenter")}
              className="h-8"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => executeCommand("justifyRight")}
              className="h-8"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 bg-transparent"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                      selectionRef.current = selection
                        .getRangeAt(0)
                        .cloneRange();
                    }
                  }}
                >
                  <Link className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Insert Link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="linkUrl">URL</Label>
                    <Input
                      id="linkUrl"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleLinkInsert}>Insert Link</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="sm"
              onClick={() => executeCommand("removeFormat")}
              className="h-8"
            >
              <Type className="h-4 w-4" />
              <span className="ml-1 text-xs">Clear</span>
            </Button>
          </div>
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[300px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            style={{ whiteSpace: "pre-wrap" }}
            onInput={handleContentChange}
            suppressContentEditableWarning={true}
          />

          <div className="space-y-2">
            <Label htmlFor="tags-combobox">Tags</Label>
            <div className="relative">
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCombobox}
                    className="w-full justify-between"
                  >
                    <span className="truncate">
                      {selectedTags.length > 0
                        ? `${selectedTags.length} tag(s) selected`
                        : "Select tags..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-[100]">
                  <Command>
                    <CommandInput placeholder="Search tags..." />
                    <CommandList>
                      <CommandEmpty>No tags found.</CommandEmpty>
                      <CommandGroup>
                        {availableTags.map((tag) => (
                          <CommandItem
                            key={tag}
                            value={tag}
                            onSelect={() => {
                              handleTagToggle(tag);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedTags.includes(tag)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {tag}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 min-h-[38px]">
              {selectedTags.length > 0 ? (
                selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    className="flex items-center gap-1 bg-muted/50 text-foreground"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className="ml-1 text-foreground/70 hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No tags selected.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} className="px-8">
              Post Question
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
