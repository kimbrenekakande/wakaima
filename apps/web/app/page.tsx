import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function () {
  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center place-self-center">
      <Button size={"lg"}>
          <Link href={"/dashboard"}>
            Enter
          </Link>
        </Button>
    </div>
  )
}