import Link from "next/link";

import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <>
      <header className="w-full border-b">
        <nav className="max-w-4xl mx-auto flex justify-between items-center py-2 px-4">
          <h1 className="font-bold">
            <Link href="/app">Appwrite NextJS Starter</Link>
          </h1>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button size="sm" asChild className="mr-2">
              <Link href="/signup">Sign Up</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/game">Play Idle Game</Link>
            </Button>
          </div>
        </nav>
      </header>
    </>
  );
}
