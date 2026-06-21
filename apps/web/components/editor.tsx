"use client"

import { EmailEditor } from "@react-email/editor"
import { extendTheme } from "@react-email/editor/plugins"
import "@react-email/editor/themes/default.css"


const customTheme = extendTheme("basic", {
  body: {
    backgroundColor: "transparent",
    display: "block",
    minWidth: "30vw",
    minHeight : "80vh"

  },
  container: {
    backgroundColor: "transparent",
    color: "white",
    minHeight : "80vh"
  }
}
)

const Editor = ({ draft }: { draft: string }) => {
  return <EmailEditor content={draft} theme={customTheme}/>
}

export default Editor;
