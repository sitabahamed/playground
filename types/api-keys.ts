export type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'perplexity';

export interface APIKey {
  id: string;
  provider: AIProvider;
  encrypted_key: string;
  is_valid: boolean;
  last_verified: string | null;
  created_at: string;
}

export interface APIKeyStatus {
  provider: AIProvider;
  is_configured: boolean;
  is_valid: boolean;
  last_verified: string | null;
}

export interface APIKeyInput {
  provider: AIProvider;
  api_key: string;
}

export const AI_PROVIDERS: Record<AIProvider, { name: string; description: string; docs: string }> = {
  openai: {
    name: 'OpenAI',
    description: 'GPT-4 for creative content generation',
    docs: 'https://platform.openai.com/api-keys',
  },
  anthropic: {
    name: 'Anthropic Claude',
    description: 'Claude for SEO optimization and quality checks',
    docs: 'https://console.anthropic.com/',
  },
  gemini: {
    name: 'Google Gemini',
    description: 'Gemini for search intent analysis',
    docs: 'https://makersuite.google.com/app/apikey',
  },
  perplexity: {
    name: 'Perplexity',
    description: 'Research and fact verification',
    docs: 'https://www.perplexity.ai/settings/api',
  },
};
