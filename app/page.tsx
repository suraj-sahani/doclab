import CreateDocumentButton from "@/components/create-document-btn";
import { SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <section className="space-y-2">
      <CreateDocumentButton />
      <SignInButton />
    </section>
  );
}
