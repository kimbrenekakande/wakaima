"use client"

import { EmailEditor, EmailEditorRef } from "@react-email/editor"
import { composeReactEmail } from "@react-email/editor/core"
import { extendTheme } from "@react-email/editor/plugins"
import { Inspector } from "@react-email/editor/ui"
import "@react-email/editor/themes/default.css"
import { Button } from "./ui/button"
import { useRef } from "react"


const customTheme = extendTheme("basic", {
  body: {
    backgroundColor: "transparent",
    display: "block",
    minWidth: "30vw",
    minHeight: "80vh",
    padding: "2rem",
  },
  container: {
    backgroundColor: "transparent",
    color: "white",
    minHeight : "80vh"
  }
}
)

const Editor = ({ content }: { content: string }) => {
  const editorRef = useRef<EmailEditorRef>(null)
  
  const handleSend = async () => {
    if (!editorRef.current?.editor) return;
    
    const { text, html } = await composeReactEmail({
      editor : editorRef.current.editor
    })

    console.log(html)
  }

  const sidebar = () => {
    return (
      <Inspector.Root className="w-60 shrink-0 border flex flex-col overflow-y-auto pt-8 p-4 ">
        <Inspector.Document />
        <Inspector.Node />
        <Inspector.Text />
      </Inspector.Root>
    )
  }
  
  return (  
    <div>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <EmailEditor
          content={content}
          theme={customTheme}
          ref={editorRef}
          // className="flex-1 max-w-0 h-full overflow-y-auto"
        />
      </div>
      <Button onClick={handleSend}> Send Email </Button>
    </div>
    
  )
} 

export default Editor;
