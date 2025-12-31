"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AI_PROVIDERS, type AIProvider, type APIKeyStatus } from "@/types/api-keys";
import { CheckCircle2, XCircle, Loader2, ExternalLink } from "lucide-react";

export default function APISettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState<Record<AIProvider, APIKeyStatus>>({} as any);
  const [editMode, setEditMode] = useState<AIProvider | null>(null);
  const [newApiKey, setNewApiKey] = useState("");
  const [testing, setTesting] = useState<AIProvider | null>(null);
  const [saving, setSaving] = useState<AIProvider | null>(null);

  useEffect(() => {
    fetchAPIKeys();
  }, []);

  const fetchAPIKeys = async () => {
    try {
      const response = await fetch('/api/settings/api-keys');
      if (response.ok) {
        const data = await response.json();
        const keysMap = data.keys.reduce((acc: any, key: APIKeyStatus) => {
          acc[key.provider] = key;
          return acc;
        }, {});
        setApiKeys(keysMap);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load API keys",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = async (provider: AIProvider) => {
    if (!newApiKey.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an API key",
      });
      return;
    }

    setSaving(provider);
    try {
      const response = await fetch('/api/settings/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, api_key: newApiKey }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${AI_PROVIDERS[provider].name} API key saved`,
        });
        setEditMode(null);
        setNewApiKey("");
        await fetchAPIKeys();
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save API key",
      });
    } finally {
      setSaving(null);
    }
  };

  const handleTestKey = async (provider: AIProvider) => {
    setTesting(provider);
    try {
      const response = await fetch('/api/settings/api-keys/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: `${AI_PROVIDERS[provider].name} API key is valid`,
        });
        await fetchAPIKeys();
      } else {
        toast({
          variant: "destructive",
          title: "Test Failed",
          description: result.error || "API key is invalid",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to test API key",
      });
    } finally {
      setTesting(null);
    }
  };

  const handleDeleteKey = async (provider: AIProvider) => {
    try {
      const response = await fetch(`/api/settings/api-keys?provider=${provider}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${AI_PROVIDERS[provider].name} API key removed`,
        });
        await fetchAPIKeys();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete API key",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">API Configuration</h1>
        <p className="text-muted-foreground">
          Configure your AI provider API keys. All keys are encrypted and stored securely.
        </p>
      </div>

      <div className="space-y-4">
        {(Object.keys(AI_PROVIDERS) as AIProvider[]).map((provider) => {
          const providerInfo = AI_PROVIDERS[provider];
          const keyStatus = apiKeys[provider];
          const isEditing = editMode === provider;

          return (
            <Card key={provider}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {providerInfo.name}
                        {keyStatus?.is_configured && (
                          keyStatus.is_valid ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )
                        )}
                      </CardTitle>
                      <CardDescription>{providerInfo.description}</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href={providerInfo.docs} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Get API Key
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${provider}-key`}>API Key</Label>
                      <Input
                        id={`${provider}-key`}
                        type="password"
                        placeholder="Enter your API key"
                        value={newApiKey}
                        onChange={(e) => setNewApiKey(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSaveKey(provider)}
                        disabled={saving === provider}
                      >
                        {saving === provider ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditMode(null);
                          setNewApiKey("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {keyStatus?.is_configured ? (
                      <>
                        <span className="text-sm text-muted-foreground">
                          API key configured •{" "}
                          {keyStatus.last_verified && (
                            <>
                              Last verified:{" "}
                              {new Date(keyStatus.last_verified).toLocaleDateString()}
                            </>
                          )}
                        </span>
                        <div className="flex-1" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestKey(provider)}
                          disabled={testing === provider}
                        >
                          {testing === provider ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Testing...
                            </>
                          ) : (
                            "Test Connection"
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditMode(provider)}
                        >
                          Update
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteKey(provider)}
                        >
                          Remove
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="text-sm text-muted-foreground">
                          No API key configured
                        </span>
                        <div className="flex-1" />
                        <Button size="sm" onClick={() => setEditMode(provider)}>
                          Add API Key
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Your API keys are encrypted and stored securely in the database</p>
          <p>• The platform uses your own API keys - you only pay for what you use</p>
          <p>
            • Each AI provider has different pricing - refer to their documentation for
            details
          </p>
          <p>• You can monitor your usage and costs in the Usage & Billing section</p>
        </CardContent>
      </Card>
    </div>
  );
}
