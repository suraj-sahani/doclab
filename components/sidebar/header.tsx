import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="container flex justify-between items-center px-4 py-2 gap-4">
      <Link href={"/"}>Doclab</Link>
      <div className="flex items-center gap-4">
        <Show when="signed-out">
          <SignInButton>
            <Button variant={"outline"} size={"xs"}>
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button variant={"secondary"} size={"xs"}>
              Sign Up
            </Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header>
  );
}
