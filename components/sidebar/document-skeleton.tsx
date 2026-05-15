import { SidebarContent } from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";

export default function DocumentSkeleton() {
  return Array.from({ length: 5 }, (_, index) => index).map((i) => (
    <Skeleton key={i} className="h-6 w-full" />
  ));
}
