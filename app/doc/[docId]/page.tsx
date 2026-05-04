import DocumentDetails from "@/components/document";

export default async function Doc({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const { docId } = await params;
  return <DocumentDetails documentId={docId} />;
}
