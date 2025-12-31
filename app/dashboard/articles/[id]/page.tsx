"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import type { Article } from "@/types/articles";

export default function ArticleViewPage() {
  const params = useParams();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [params.id]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data.article);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (article?.content) {
      navigator.clipboard.writeText(article.content);
      toast({
        title: "Copied!",
        description: "Article content copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Article not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{article.title || article.target_keyword}</h1>
          <p className="text-muted-foreground">
            Created {new Date(article.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Markdown
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Preview</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <ReactMarkdown>{article.content || 'No content available'}</ReactMarkdown>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="text-muted-foreground">Status</div>
                <div className="font-medium capitalize">{article.status}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Target Keyword</div>
                <div className="font-medium">{article.target_keyword}</div>
              </div>
              {article.word_count && (
                <div>
                  <div className="text-muted-foreground">Word Count</div>
                  <div className="font-medium">{article.word_count} words</div>
                </div>
              )}
              {article.seo_score && (
                <div>
                  <div className="text-muted-foreground">SEO Score</div>
                  <div className="font-medium">{article.seo_score}/100</div>
                </div>
              )}
              <div>
                <div className="text-muted-foreground">Tone</div>
                <div className="font-medium capitalize">{article.tone}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Formatting</div>
                <div className="font-medium capitalize">
                  {article.formatting_preset.replace('_', ' ')}
                </div>
              </div>
            </CardContent>
          </Card>

          {article.meta_description && (
            <Card>
              <CardHeader>
                <CardTitle>SEO Meta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground mb-1">Meta Description</div>
                  <p className="text-sm">{article.meta_description}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
