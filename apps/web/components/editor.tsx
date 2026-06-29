"use client"

import { EmailEditor, EmailEditorRef } from "@react-email/editor"
import { composeReactEmail } from "@react-email/editor/core"
import { extendTheme } from "@react-email/editor/plugins"
import { Inspector } from "@react-email/editor/ui"
import "@react-email/editor/themes/default.css"
import { Button } from "./ui/button"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, FloppyDiskIcon } from "@hugeicons/core-free-icons"
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
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const editorRef = useRef<EmailEditorRef>(null)

  const editorContent = async () => {
    if (!editorRef.current?.editor) return;

    const { text, html } = await composeReactEmail({
      editor : editorRef.current.editor
    })
    return { text, html }
  }

  const handleSave = async () => {
    const result = await editorContent()
    if (!result?.text || !result?.html) return
    const { text, html } = result
    const turndownService = new TurndownService()
    const toMarkdown = turndownService.turndown(html)

    await updateEmailBody(Number(id), toMarkdown)
    router.back()
  }

  const handleSend =  async () => {
    const result = await editorContent()
    if (!result?.text || !result?.html) return

    const turndownService = new TurndownService()
    const toMarkdown = turndownService.turndown(result.html)

    setSending(true)
    try {
      await sendEmail(Number(id), toMarkdown)
    } catch (error) {
      console.error('Send failed:', error)
    }
    setSending(false)
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
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-b from-background via-background to-transparent pb-3">
        <Link href="/dashboard/emails">
          <Button variant="ghost" size="sm" className="gap-1.5 cursor-pointer">
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            <span>Back to Emails</span>
          </Button>
        </Link>
        <div className="flex flex-row gap-2 items-center">
          <Button onClick={handleSave} variant="outline" size="icon">
            <HugeiconsIcon icon={FloppyDiskIcon} className="size-4" />
          </Button>
          <Button onClick={handleSend} disabled={sending}>
            {sending ? "Sending..." : "Send Email"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full h-full">
        <EmailEditor
          content={content}
          theme={customTheme}
          ref={editorRef}
          // className="flex-1 max-w-0 h-full overflow-y-auto"
        />
      </div>

    </div>

  )
}

export default Editor;
