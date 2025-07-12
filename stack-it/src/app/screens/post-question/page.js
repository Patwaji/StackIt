import { TextEditor } from "@/components/text-editor/text-editor";
import React from "react";

export default function PostQuestion() {
  return (
    <div>
      <h1 className="max-w-4xl mx-auto py-2 px-6 space-y-6 text-3xl">
        Ask a Question
      </h1>
      <TextEditor />
    </div>
  );
}
