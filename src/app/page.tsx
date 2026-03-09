import { Hero } from "@/components/home/Hero";
import { SocialGrid } from "@/components/home/SocialGrid";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <SocialGrid />
    </main>
  );
}
