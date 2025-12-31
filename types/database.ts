export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          provider: string
          encrypted_key: string
          is_valid: boolean
          last_verified: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: string
          encrypted_key: string
          is_valid?: boolean
          last_verified?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: string
          encrypted_key?: string
          is_valid?: boolean
          last_verified?: string | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          brand_voice: string | null
          default_tone: string
          website_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          brand_voice?: string | null
          default_tone?: string
          website_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          brand_voice?: string | null
          default_tone?: string
          website_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          target_keyword: string
          secondary_keywords: string[] | null
          search_intent: string | null
          title: string | null
          meta_description: string | null
          outline: Json | null
          content: string | null
          serp_analysis: Json | null
          research_data: Json | null
          seo_score: number | null
          word_count: number | null
          readability_score: number | null
          status: string
          generation_step: string | null
          error_message: string | null
          formatting_preset: string
          tone: string
          target_word_count: number
          generation_cost: number | null
          generation_time: number | null
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          target_keyword: string
          secondary_keywords?: string[] | null
          search_intent?: string | null
          title?: string | null
          meta_description?: string | null
          outline?: Json | null
          content?: string | null
          serp_analysis?: Json | null
          research_data?: Json | null
          seo_score?: number | null
          word_count?: number | null
          readability_score?: number | null
          status?: string
          generation_step?: string | null
          error_message?: string | null
          formatting_preset?: string
          tone?: string
          target_word_count?: number
          generation_cost?: number | null
          generation_time?: number | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          target_keyword?: string
          secondary_keywords?: string[] | null
          search_intent?: string | null
          title?: string | null
          meta_description?: string | null
          outline?: Json | null
          content?: string | null
          serp_analysis?: Json | null
          research_data?: Json | null
          seo_score?: number | null
          word_count?: number | null
          readability_score?: number | null
          status?: string
          generation_step?: string | null
          error_message?: string | null
          formatting_preset?: string
          tone?: string
          target_word_count?: number
          generation_cost?: number | null
          generation_time?: number | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      article_versions: {
        Row: {
          id: string
          article_id: string
          version_number: number
          content: string
          outline: Json | null
          created_at: string
          change_summary: string | null
        }
        Insert: {
          id?: string
          article_id: string
          version_number: number
          content: string
          outline?: Json | null
          created_at?: string
          change_summary?: string | null
        }
        Update: {
          id?: string
          article_id?: string
          version_number?: number
          content?: string
          outline?: Json | null
          created_at?: string
          change_summary?: string | null
        }
      }
      batch_jobs: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          name: string | null
          status: string
          total_articles: number
          completed_articles: number
          failed_articles: number
          settings: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          name?: string | null
          status?: string
          total_articles?: number
          completed_articles?: number
          failed_articles?: number
          settings?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          name?: string | null
          status?: string
          total_articles?: number
          completed_articles?: number
          failed_articles?: number
          settings?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      batch_job_items: {
        Row: {
          id: string
          batch_job_id: string
          article_id: string | null
          keyword: string
          status: string
          error_message: string | null
          position: number | null
          created_at: string
        }
        Insert: {
          id?: string
          batch_job_id: string
          article_id?: string | null
          keyword: string
          status?: string
          error_message?: string | null
          position?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          batch_job_id?: string
          article_id?: string | null
          keyword?: string
          status?: string
          error_message?: string | null
          position?: number | null
          created_at?: string
        }
      }
      usage_logs: {
        Row: {
          id: string
          user_id: string
          article_id: string | null
          provider: string
          model: string
          tokens_input: number | null
          tokens_output: number | null
          cost: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          article_id?: string | null
          provider: string
          model: string
          tokens_input?: number | null
          tokens_output?: number | null
          cost?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          article_id?: string | null
          provider?: string
          model?: string
          tokens_input?: number | null
          tokens_output?: number | null
          cost?: number | null
          created_at?: string
        }
      }
    }
  }
}
