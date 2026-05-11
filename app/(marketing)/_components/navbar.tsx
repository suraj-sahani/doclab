"use client";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight04Icon } from "@hugeicons/core-free-icons";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <div
      className={cn(
        `bg-background dark:bg-[#1F1F1F] flex items-center w-full p-4`,
      )}
    >
      <Link href={"/"}>
        <Logo />
      </Link>
      <div className="md:ml-auto md:justify-end flex gap-x-2 justify-between items-center w-full">
        <Show when={"signed-out"}>
          <SignInButton mode="modal">
            <Button variant={"outline"} size={"sm"}>
              Login
            </Button>
          </SignInButton>

          <SignUpButton mode="modal">
            <Button size={"sm"}>Sign Up</Button>
          </SignUpButton>
        </Show>
        <Show when={"signed-in"}>
          <Link href="/documents">
            <Button size="sm">
              Enter Doclab
              <HugeiconsIcon
                icon={ArrowRight04Icon}
                size={24}
                color="currentColor"
                strokeWidth={1.5}
              />
            </Button>
          </Link>
        </Show>

        <ThemeToggle />
      </div>
    </div>
  );
}
