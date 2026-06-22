import Editor from "@/components/editor";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditorPage({ params }: Props) {
  const { id } = await params;
  const emailId = Number(id);
  const draft = await prisma.email.findUnique({
    where: { id: emailId },
  });
  
  return (
    <div className="h-full w-full">
      <Editor content={ draft?.body || ""} />
    </div>
  );
}
