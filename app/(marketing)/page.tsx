import Heading from "./_components/heading";
import { Heroes } from "./_components/heroes";

export default function MarketingPage() {
  return (
    <section className="h-full flex flex-col items-center justify-center gap-8 text-center dark:bg-[#1F1F1F]">
      <Heading />
      <Heroes />
    </section>
  );
}
