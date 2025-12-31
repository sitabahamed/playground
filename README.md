# AI Content Orchestrator

Advanced SEO Content Generation Platform that orchestrates multiple AI models (OpenAI GPT-4, Anthropic Claude, Google Gemini, and Perplexity) to generate high-quality, SEO-optimized blog articles.

## Features

- **Multi-AI Orchestration**: Leverages the best of each AI model
  - GPT-4 for creative writing
  - Claude for SEO optimization and quality checks
  - Gemini for search intent analysis
  - Perplexity for factual research and citations

- **5-Step Article Generation Wizard**:
  1. Keyword input
  2. Research & analysis (auto-runs)
  3. Outline review & editing
  4. Settings configuration
  5. Content generation with live progress

- **SEO-Optimized Content**: Publish-ready articles with proper structure, meta tags, FAQs, and keyword optimization

- **Batch Processing**: Scale content creation by processing multiple articles with consistent quality

- **Project Management**: Organize articles by projects with custom brand voice

- **Real-time Progress Tracking**: Monitor generation status with live updates

## Tech Stack

### Frontend
- Next.js 14 with App Router
- React 18+ with TypeScript
- Tailwind CSS + Shadcn/ui components
- React Query for state management
- Zustand for global state

### Backend
- Next.js API Routes
- Supabase (PostgreSQL + Auth)
- Server-Sent Events for real-time updates

### AI Integrations
- OpenAI API (GPT-4/GPT-4o)
- Anthropic API (Claude 3.5 Sonnet)
- Google Gemini API (Gemini 1.5 Pro)
- Perplexity API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- API keys for AI providers (users provide their own)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-content-orchestrator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials and encryption key.

4. Set up the Supabase database:
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql`
   - Configure authentication providers

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
ai-content-orchestrator/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── dashboard/
│   │   ├── articles/
│   │   ├── batch/
│   │   └── settings/
│   ├── api/                 # API routes
│   │   ├── auth/
│   │   ├── articles/
│   │   ├── generate/
│   │   └── settings/
│   ├── layout.tsx
│   └── page.tsx
├── components/              # React components
│   ├── ui/                 # Shadcn/ui components
│   ├── article/            # Article-related components
│   ├── dashboard/          # Dashboard components
│   └── providers.tsx
├── lib/                    # Utilities and configurations
│   ├── supabase/          # Supabase client
│   ├── ai/                # AI provider integrations
│   └── utils.ts
├── types/                  # TypeScript type definitions
├── hooks/                  # Custom React hooks
└── utils/                  # Helper functions
```

## Usage

### Setting Up API Keys

1. Navigate to Settings > API Configuration
2. Add your API keys for each AI provider
3. Test connections to verify

### Creating an Article

1. Click "New Article" from the dashboard
2. Enter your target keyword
3. Review the auto-generated research and outline
4. Configure settings (tone, word count, formatting)
5. Generate and review the content
6. Export or publish

### Batch Generation

1. Navigate to Batch section
2. Enter multiple keywords (or upload CSV)
3. Configure shared settings
4. Monitor progress for all articles

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=        # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Your Supabase anon key

# Encryption
ENCRYPTION_KEY=                   # 32-byte hex key for API key encryption
```

## Database Schema

See `docs/database-schema.md` for complete database documentation.

Key tables:
- `users` - User accounts
- `api_keys` - Encrypted API keys per user
- `projects` - Content organization
- `articles` - Generated articles with metadata
- `batch_jobs` - Batch processing jobs

## API Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/articles` - List articles
- `POST /api/articles` - Create new article
- `POST /api/generate/start` - Start generation pipeline
- `GET /api/generate/stream/:jobId` - SSE progress updates

See `docs/api-reference.md` for complete API documentation.

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [repository-url]/issues
- Documentation: [docs-url]
