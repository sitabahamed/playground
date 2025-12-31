import { createClient } from '@/lib/supabase/server';
import { decryptApiKey } from '@/lib/encryption';
import { NextResponse } from 'next/server';

// Simple test functions for each provider
async function testOpenAI(apiKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, error: error.error?.message || 'Invalid API key' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function testAnthropic(apiKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }],
      }),
    });

    if (response.ok || response.status === 200) {
      return { success: true };
    } else {
      return { success: false, error: 'Invalid API key' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function testGemini(apiKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: 'Invalid API key' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function testPerplexity(apiKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 10,
      }),
    });

    if (response.ok || response.status === 200) {
      return { success: true };
    } else {
      return { success: false, error: 'Invalid API key' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { provider } = await request.json();

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider is required' },
        { status: 400 }
      );
    }

    // Get the encrypted API key
    const { data: apiKeyData, error } = await supabase
      .from('api_keys')
      .select('encrypted_key')
      .eq('user_id', user.id)
      .eq('provider', provider)
      .single();

    if (error || !apiKeyData) {
      return NextResponse.json(
        { error: 'API key not found for this provider' },
        { status: 404 }
      );
    }

    // Decrypt and test the API key
    const apiKey = decryptApiKey(apiKeyData.encrypted_key);
    let result;

    switch (provider) {
      case 'openai':
        result = await testOpenAI(apiKey);
        break;
      case 'anthropic':
        result = await testAnthropic(apiKey);
        break;
      case 'gemini':
        result = await testGemini(apiKey);
        break;
      case 'perplexity':
        result = await testPerplexity(apiKey);
        break;
      default:
        return NextResponse.json(
          { error: 'Unknown provider' },
          { status: 400 }
        );
    }

    // Update the is_valid status
    await supabase
      .from('api_keys')
      .update({
        is_valid: result.success,
        last_verified: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('provider', provider);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
