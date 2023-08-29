import React, { useEffect, useState } from "react";
import {
  BlockNoteView,
  useBlockNote,
  lightDefaultTheme,
} from "@blocknote/react";
import "@blocknote/core/style.css";

function MarkdownEditor({ content, setContent }) {
  const editor = useBlockNote({
    onEditorContentChange: (editor) => {
      const saveBlocksAsMarkdown = async () => {
        const markdown = await editor.blocksToMarkdown(editor.topLevelBlocks);
        setContent(markdown);
      };
      saveBlocksAsMarkdown();
    },
  });

  useEffect(() => {
    if (editor) {
      const getBlocks = async () => {
        const blocks = await editor.markdownToBlocks(content);
        editor.replaceBlocks(editor.topLevelBlocks, blocks);
      };
      getBlocks();
    }
  });

  const lightTheme = {
    ...lightDefaultTheme,
    fontFamily: "Quicksand, sans-serif",
  };

  return (
    <div className="h-full w-full">
      <BlockNoteView editor={editor} theme={lightTheme} />
    </div>
  );
}

export default MarkdownEditor;
