export default async function Doc({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const { docId } = await params;
  return <section>{docId}</section>;
}
