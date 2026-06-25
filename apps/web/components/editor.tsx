"use client"

import { EmailEditor, EmailEditorRef } from "@react-email/editor"
import { composeReactEmail } from "@react-email/editor/core"
import { extendTheme } from "@react-email/editor/plugins"
import { Inspector } from "@react-email/editor/ui"
import "@react-email/editor/themes/default.css"
import { Button } from "./ui/button"
import { useRef } from "react"
import TurndownService from "turndown"
import { updateEmailBody, sendEmail } from "@/lib/actions/email-actions"


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

const Editor = ({id, content }: { id: number; content: string }) => {
  const editorRef = useRef<EmailEditorRef>(null)

  const editorContent = async () => {
    if (!editorRef.current?.editor) return;

    const { text, html } = await composeReactEmail({
      editor : editorRef.current.editor
    })
    return { text, html }
  }

  const handleSave = async () => {
    const { text, html } = await editorContent()
    if (!text || !html) return
    const turndownService = new TurndownService()
    const toMarkdown = turndownService.turndown(html)

    await updateEmailBody(Number(id), toMarkdown)
  }

  const handleSend =  async () => {
    const { text, html } = await editorContent()
    if (!text || !html) return
    
    await sendEmail(Number(id))
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
      <div className="flex flex-row">
        <Button onClick={handleSave}> Send Email </Button>
        <Button onClick={handleSend}> Send Email </Button>
      </div>

    </div>

  )
}

export default Editor;
