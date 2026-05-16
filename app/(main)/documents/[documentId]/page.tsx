export default async function DocumentDetailsPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;

  return <>{documentId}</>;
}
