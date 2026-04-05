import { Hero } from "@/components/home/Hero";
import { SocialGrid } from "@/components/home/SocialGrid";
import { Achievements } from "@/components/home/Achievements";
import { PlayerSection } from "@/components/home/PlayerSection";
import { Merchandise } from "@/components/home/Merchandise";
import { getSocialStats } from "@/lib/get-social-stats";
import { getLiquipediaAchievements } from "@/lib/liquipedia";

export default async function Home() {
  const stats = await getSocialStats();
  const achievements = await getLiquipediaAchievements();
  
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <SocialGrid stats={stats} />
      <PlayerSection />
      <Merchandise />
      <Achievements achievements={achievements} />
    </main>
  );
}
