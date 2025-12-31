import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');
    const status = searchParams.get('status');

    let query = supabase
      .from('articles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: articles, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ articles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { target_keyword, secondary_keywords, project_id, settings } = body;

    if (!target_keyword) {
      return NextResponse.json(
        { error: 'Target keyword is required' },
        { status: 400 }
      );
    }

    // Create article record with initial status
    const { data: article, error } = await supabase
      .from('articles')
      .insert({
        user_id: user.id,
        target_keyword,
        secondary_keywords: secondary_keywords || [],
        project_id: project_id || null,
        status: 'draft',
        formatting_preset: settings?.formatting_preset || 'clean_editorial',
        tone: settings?.tone || 'professional',
        target_word_count: settings?.target_word_count || 1500,
        title: `Article: ${target_keyword}`,
        content: `# ${target_keyword}\n\nThis is a placeholder article. The AI generation pipeline will be implemented to create full SEO-optimized content.\n\n## Key Points\n\n- Research-backed content\n- SEO optimization\n- Multiple AI models working together\n\n## Coming Soon\n\nThe full AI pipeline integration is being developed to generate comprehensive, high-quality articles automatically.`,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // TODO: Trigger background job for AI generation pipeline
    // For now, we just return the created article

    return NextResponse.json({ article });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
