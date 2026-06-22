"use client"

import { EmailEditor } from "@react-email/editor"
import { extendTheme } from "@react-email/editor/plugins"
import "@react-email/editor/themes/default.css"


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

const Editor = ({ content }: { content : string }) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <EmailEditor content={content} theme={customTheme} />
    </div>
  )
}

export default Editor;
