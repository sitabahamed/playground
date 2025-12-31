"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, DollarSign, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";

interface DashboardStats {
  totalArticles: number;
  articlesThisMonth: number;
  estimatedCost: number;
  avgSeoScore: number;
}

interface RecentArticle {
  id: string;
  title: string;
  status: string;
  seo_score: number;
  created_at: string;
}

export default function DashboardPage() {
  const { user } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    articlesThisMonth: 0,
    estimatedCost: 0,
    avgSeoScore: 0,
  });
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        // Fetch total articles
        const { count: totalCount } = await supabase
          .from("articles")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        // Fetch articles this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count: monthCount } = await supabase
          .from("articles")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", startOfMonth.toISOString());

        // Fetch cost and SEO score stats
        const { data: articles } = await supabase
          .from("articles")
          .select("generation_cost, seo_score")
          .eq("user_id", user.id);

        const totalCost = articles?.reduce((sum, a) => sum + (a.generation_cost || 0), 0) || 0;
        const avgScore = articles?.length
          ? articles.reduce((sum, a) => sum + (a.seo_score || 0), 0) / articles.length
          : 0;

        // Fetch recent articles
        const { data: recent } = await supabase
          .from("articles")
          .select("id, title, status, seo_score, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        setStats({
          totalArticles: totalCount || 0,
          articlesThisMonth: monthCount || 0,
          estimatedCost: totalCost,
          avgSeoScore: Math.round(avgScore),
        });

        setRecentArticles(recent || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  if (!user) return null;

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to AI Content Orchestrator</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/articles/new">
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "-" : stats.totalArticles}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "-" : stats.articlesThisMonth}</div>
            <p className="text-xs text-muted-foreground">Articles generated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${loading ? "-" : stats.estimatedCost.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Total spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg SEO Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "-" : stats.avgSeoScore}/100</div>
            <p className="text-xs text-muted-foreground">Across all articles</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Articles</CardTitle>
              <CardDescription>Your latest generated content</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/articles">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : recentArticles.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first article to get started
              </p>
              <Button asChild>
                <Link href="/dashboard/articles/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Article
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/dashboard/articles/${article.id}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {article.title || "Untitled Article"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(article.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        article.status === "published"
                          ? "bg-green-100 text-green-800"
                          : article.status === "review"
                          ? "bg-blue-100 text-blue-800"
                          : article.status === "generating"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      )}
                    >
                      {article.status}
                    </span>
                    {article.seo_score && (
                      <span className="text-sm font-medium">
                        {article.seo_score}/100
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Start Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Configure your AI providers to start generating content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h4 className="font-medium mb-1">Configure API Keys</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Add your API keys for OpenAI, Claude, Gemini, and Perplexity
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/settings/api">Configure APIs</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 className="font-medium mb-1">Create Your First Article</h4>
              <p className="text-sm text-muted-foreground">
                Use the article wizard to generate SEO-optimized content
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
