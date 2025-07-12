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
import axios from "axios";
import { postQuestionUrl } from "@/lib/API";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function TextEditor() {
  const [content, setContent] = useState("");
  const [jsonOutput, setJsonOutput] = useState(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const editorRef = useRef(null);
  const selectionRef = useRef(null);
  const router = useRouter();

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

  const handleSubmit = async () => {
    const jsonResult = parseContentToJson();
    setJsonOutput(jsonResult);

    const plainWords = jsonResult.plainText.trim().split(/\s+/);
    const title =
      "I'm asking about " +
      plainWords.slice(0, 12).join(" ") +
      (plainWords.length > 12 ? "..." : "");

    const payload = {
      ...jsonResult,
      title,
    };

    try {
      const response = await axios.post(postQuestionUrl, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Question posted successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error posting question:", error);
      toast.error("Failed to post question");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="space-y-4">
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
