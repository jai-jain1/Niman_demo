import { redirect } from "next/navigation";
import { site } from "@/content/site";

/** Until the Niman homepage is built, the root opens the live demo invitation. */
export default function Home() {
  redirect(`/i/${site.demoSlug}`);
}
