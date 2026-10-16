import { SiteNav } from "@/components/landing/site-nav";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Steps } from "@/components/landing/steps";
import { Footer } from "@/components/landing/footer";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <Features />
        <Steps />
      </main>
      <Footer />
    </div>
  );
}
