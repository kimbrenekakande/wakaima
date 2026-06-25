import Editor from "@/components/editor";
import { prisma } from "@/lib/prisma";
import markdownit from "markdown-it"

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditorPage({ params }: Props) {
  const { id } = await params;
  const emailId = Number(id);
  const draft = await prisma.email.findUnique({
    where: { id: emailId },
  });

  const md = markdownit()
  const toHtml = md.render(draft?.body)

  return (
    <div className="h-full w-full">
      <Editor id={id} content={ toHtml || ""} />
    </div>
  );
}
