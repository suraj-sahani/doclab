"use client";

import { cn } from "@/lib/utils";

// import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <div
      className={cn(
        `bg-background dark:bg-[#1F1F1F] flex items-center w-full p-4`,
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end flex gap-x-2 justify-between items-center w-full">
        <Show when={"signed-out"}>
          <SignInButton mode="modal">
            <Button variant={"outline"}>Login</Button>
          </SignInButton>

          <SignUpButton mode="modal">
            <Button>Sign Up</Button>
          </SignUpButton>
        </Show>
        <Show when={"signed-in"}>
          <Link href="/documents">
            <Button size="sm">Enter Doclab</Button>
          </Link>
        </Show>

        {/*<ModeToggle />*/}
      </div>
    </div>
  );
}
