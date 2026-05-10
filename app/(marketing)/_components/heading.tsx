import { Button } from "@/components/ui/button";

import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export default function Heading() {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas, Documents, & Plans. Unified. Welcome to{" "}
        <span className="underline">Doclab</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Doclab is the connected workspace where <br />
        better, faster work happens
      </h3>

      <Show when="signed-out">
        <div className="flex gap-3 justify-center">
          <SignInButton mode="modal">
            <Button variant={"outline"}>
              Get Doclab Free
              <HugeiconsIcon
                icon={ArrowRight04Icon}
                size={24}
                color="currentColor"
                strokeWidth={1.5}
              />
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Sign Up</Button>
          </SignUpButton>
        </div>
      </Show>

      <Show when={"signed-in"}>
        <Link href="/documents">
          <Button>
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
    </div>
  );
}
