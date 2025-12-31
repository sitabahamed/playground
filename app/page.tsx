import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full text-center space-y-8">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          AI Content Orchestrator
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Orchestrate multiple AI models to generate high-quality, SEO-optimized blog articles.
          Combine the strengths of GPT-4, Claude, Gemini, and Perplexity.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/login">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">Sign Up</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">Multi-AI Orchestration</h3>
            <p className="text-sm text-muted-foreground">
              Leverage the best of each AI model: GPT-4 for creative writing, Claude for SEO,
              Gemini for research, and Perplexity for facts.
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">SEO-Optimized Content</h3>
            <p className="text-sm text-muted-foreground">
              Generate publish-ready articles with proper structure, meta tags, FAQs,
              and keyword optimization built in.
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-2">Batch Processing</h3>
            <p className="text-sm text-muted-foreground">
              Scale your content creation with batch generation. Process dozens of
              articles with consistent quality and formatting.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
