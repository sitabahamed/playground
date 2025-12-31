"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { FORMATTING_PRESETS, TONE_OPTIONS, type GenerationSettings } from "@/types/articles";

const STEPS = [
  { number: 1, title: "Target Keyword" },
  { number: 2, title: "Research & Analysis" },
  { number: 3, title: "Article Outline" },
  { number: 4, title: "Generation Settings" },
  { number: 5, title: "Generating Content" },
];

export default function NewArticlePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Keyword Input
  const [keyword, setKeyword] = useState("");
  const [secondaryKeywords, setSecondaryKeywords] = useState("");
  const [projectId, setProjectId] = useState<string>("");

  // Step 2: Research (auto-runs, results displayed)
  const [researchComplete, setResearchComplete] = useState(false);

  // Step 3: Outline
  const [outlineGenerated, setOutlineGenerated] = useState(false);

  // Step 4: Settings
  const [settings, setSettings] = useState<GenerationSettings>({
    formatting_preset: 'listicle_power',
    tone: 'professional',
    target_word_count: 2000,
    include_faq: true,
    include_toc: true,
    include_takeaways: true,
    include_images: true,
    include_tables: false,
  });

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return keyword.trim().length > 0;
      case 2:
        return researchComplete;
      case 3:
        return outlineGenerated;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      // Move to research step
      setCurrentStep(2);
      // Simulate research
      setLoading(true);
      setTimeout(() => {
        setResearchComplete(true);
        setLoading(false);
      }, 2000);
    } else if (currentStep === 2) {
      // Move to outline step
      setCurrentStep(3);
      // Simulate outline generation
      setLoading(true);
      setTimeout(() => {
        setOutlineGenerated(true);
        setLoading(false);
      }, 1500);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Start generation
      await startGeneration();
    }
  };

  const startGeneration = async () => {
    setCurrentStep(5);
    setLoading(true);

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_keyword: keyword,
          secondary_keywords: secondaryKeywords.split(',').map(k => k.trim()).filter(Boolean),
          project_id: projectId || null,
          settings,
        }),
      });

      if (response.ok) {
        const { article } = await response.json();
        toast({
          title: "Article Created!",
          description: "Your article has been created successfully.",
        });
        router.push(`/dashboard/articles/${article.id}`);
      } else {
        throw new Error('Failed to create article');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create article",
      });
      setLoading(false);
    }
  };

  const progressPercentage = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Create New Article</h1>
          <p className="text-muted-foreground">
            Follow the steps to generate SEO-optimized content
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Step {currentStep} of {STEPS.length}
            </span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex items-center justify-between">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className={`flex flex-col items-center gap-2 ${
                  currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold ${
                    currentStep >= step.number
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-muted-foreground'
                  }`}
                >
                  {step.number}
                </div>
                <span className="text-xs text-center hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Enter your target keyword and optional details"}
              {currentStep === 2 && "Analyzing search intent and researching facts"}
              {currentStep === 3 && "Review and customize the article outline"}
              {currentStep === 4 && "Configure generation settings"}
              {currentStep === 5 && "Generating your SEO-optimized article"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Keyword Input */}
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="keyword">Primary Keyword *</Label>
                  <Input
                    id="keyword"
                    placeholder="e.g., best shampoo bars for curly hair"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the main keyword you want to rank for
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary">Secondary Keywords (optional)</Label>
                  <Textarea
                    id="secondary"
                    placeholder="sulfate-free shampoo, natural hair care (comma-separated)"
                    value={secondaryKeywords}
                    onChange={(e) => setSecondaryKeywords(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project">Project (optional)</Label>
                  <Select value={projectId} onValueChange={setProjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Project</SelectItem>
                      {/* Projects would be loaded from database */}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Step 2: Research */}
            {currentStep === 2 && (
              <div className="space-y-4">
                {loading ? (
                  <div className="py-12 text-center">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Researching your topic...</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">✓ Search Intent Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          Intent: <span className="text-foreground">Informational/Commercial</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Users are looking for product recommendations with educational content
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">✓ Top Ranking Content Analysis</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Average word count: 2,340 words</li>
                          <li>• Common topics: Benefits, ingredients, how-to guides</li>
                          <li>• Content gaps: Sustainability focus, curly hair specific advice</li>
                        </ul>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">✓ Key Facts & Statistics</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Shampoo bars last 2-3x longer than liquid shampoo</li>
                          <li>• 80% reduction in plastic waste with solid bars</li>
                          <li>• Market growing at 8.5% annually</li>
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 3: Outline */}
            {currentStep === 3 && (
              <div className="space-y-4">
                {loading ? (
                  <div className="py-12 text-center">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Generating outline...</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Generated Title</Label>
                      <Input
                        value="10 Best Shampoo Bars for Curly Hair (2024 Guide)"
                        readOnly
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Outline Structure</Label>
                      <div className="border rounded-lg p-4 space-y-3">
                        {[
                          "Introduction",
                          "Why Switch to Shampoo Bars?",
                          "What to Look for in a Shampoo Bar",
                          "Top 10 Shampoo Bars for Curly Hair",
                          "How to Use Shampoo Bars",
                          "FAQ",
                          "Conclusion",
                        ].map((section, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 hover:bg-accent rounded">
                            <span className="text-muted-foreground">≡</span>
                            <span className="flex-1">{section}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Estimated word count: ~2,200 words
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 4: Settings */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Formatting Preset</Label>
                  <RadioGroup
                    value={settings.formatting_preset}
                    onValueChange={(value: any) =>
                      setSettings({ ...settings, formatting_preset: value })
                    }
                  >
                    {Object.entries(FORMATTING_PRESETS).map(([key, preset]) => (
                      <div key={key} className="flex items-center space-x-3 border p-3 rounded-lg">
                        <RadioGroupItem value={key} id={key} />
                        <Label htmlFor={key} className="flex-1 cursor-pointer">
                          <div className="font-medium">{preset.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {preset.description}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Tone of Voice</Label>
                  <Select
                    value={settings.tone}
                    onValueChange={(value) => setSettings({ ...settings, tone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Target Word Count: {settings.target_word_count}</Label>
                  <Slider
                    value={[settings.target_word_count]}
                    onValueChange={([value]) =>
                      setSettings({ ...settings, target_word_count: value })
                    }
                    min={1000}
                    max={4000}
                    step={100}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1000</span>
                    <span>4000</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Additional Options</Label>
                  <div className="space-y-3">
                    {[
                      { key: 'include_faq', label: 'Include FAQ section' },
                      { key: 'include_toc', label: 'Include table of contents' },
                      { key: 'include_takeaways', label: 'Include key takeaways box' },
                      { key: 'include_images', label: 'Add image placeholders with alt text' },
                      { key: 'include_tables', label: 'Include comparison tables' },
                    ].map((option) => (
                      <div key={option.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.key}
                          checked={settings[option.key as keyof GenerationSettings] as boolean}
                          onCheckedChange={(checked) =>
                            setSettings({ ...settings, [option.key]: checked })
                          }
                        />
                        <Label htmlFor={option.key} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Estimated cost: <span className="font-semibold text-foreground">~$0.45</span>
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Generation */}
            {currentStep === 5 && (
              <div className="py-12 text-center space-y-6">
                <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Creating your article...</h3>
                  <p className="text-muted-foreground">
                    This may take a few minutes. Please don't close this page.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : currentStep === 4 ? (
                "Generate Article 🚀"
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
