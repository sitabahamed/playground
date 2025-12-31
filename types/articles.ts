export interface Article {
  id: string;
  user_id: string;
  project_id: string | null;
  target_keyword: string;
  secondary_keywords: string[] | null;
  search_intent: string | null;
  title: string | null;
  meta_description: string | null;
  outline: OutlineSection[] | null;
  content: string | null;
  serp_analysis: SERPAnalysis | null;
  research_data: ResearchData | null;
  seo_score: number | null;
  word_count: number | null;
  readability_score: number | null;
  status: ArticleStatus;
  generation_step: GenerationStep | null;
  error_message: string | null;
  formatting_preset: FormattingPreset;
  tone: string;
  target_word_count: number;
  generation_cost: number | null;
  generation_time: number | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export type ArticleStatus = 'draft' | 'generating' | 'review' | 'published' | 'failed';

export type GenerationStep =
  | 'intent_analysis'
  | 'research'
  | 'serp_analysis'
  | 'outline'
  | 'content'
  | 'seo_meta'
  | 'quality_check'
  | 'complete';

export type FormattingPreset =
  | 'clean_editorial'
  | 'listicle_power'
  | 'data_driven'
  | 'faq_hunter'
  | 'custom';

export interface OutlineSection {
  id: string;
  level: 'h2' | 'h3';
  heading: string;
  notes?: string;
  target_words?: number;
}

export interface SERPAnalysis {
  intent: string;
  explanation: string;
  user_goal: string;
  avg_word_count: number;
  common_topics: string[];
  content_gaps: string[];
}

export interface ResearchData {
  facts: ResearchFact[];
  questions: string[];
  key_topics: string[];
}

export interface ResearchFact {
  fact: string;
  source: string;
  date?: string;
}

export interface GenerationSettings {
  formatting_preset: FormattingPreset;
  tone: string;
  target_word_count: number;
  include_faq: boolean;
  include_toc: boolean;
  include_takeaways: boolean;
  include_images: boolean;
  include_tables: boolean;
}

export interface ArticleInput {
  target_keyword: string;
  secondary_keywords: string[];
  project_id?: string;
  settings: GenerationSettings;
}

export interface GenerationProgress {
  status: 'idle' | 'running' | 'completed' | 'failed';
  current_step: GenerationStep | null;
  steps_completed: GenerationStep[];
  progress: number;
  error?: string;
  article_id?: string;
}

export const FORMATTING_PRESETS: Record<FormattingPreset, { name: string; description: string }> = {
  clean_editorial: {
    name: 'Clean Editorial',
    description: 'Prose-focused, elegant writing style',
  },
  listicle_power: {
    name: 'Listicle Power',
    description: 'Scannable, bullet-rich format',
  },
  data_driven: {
    name: 'Data-Driven',
    description: 'Tables, statistics, and data visualization',
  },
  faq_hunter: {
    name: 'FAQ Hunter',
    description: 'Featured snippet optimized with FAQs',
  },
  custom: {
    name: 'Custom',
    description: 'Custom formatting options',
  },
};

export const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'authoritative', label: 'Authoritative' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'conversational', label: 'Conversational' },
];
