import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { CitizensTable } from "@/components/citizens-table"

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center px-24 py-8">
      <Link
        className={buttonVariants({ variant: "default" })}
        href="create-citizen"
      >
        Create New Citizen
      </Link>
      <CitizensTable />
    </main>
  )
}
