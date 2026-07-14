'use client';

import { useState, useEffect } from 'react';
import { styles } from '@/lib/titlecase';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('title');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const capitalize = async () => {
      if (!inputText.trim()) {
        setOutputText('');
        return;
      }

      try {
        const response = await fetch('/api/capitalize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText, style: selectedStyle }),
        });

        const data = await response.json();
        setOutputText(data.result || '');
      } catch (error) {
        console.error('Error:', error);
      }
    };

    capitalize();
  }, [inputText, selectedStyle]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="container">
      <h1>📝 Title Capitalization Tool</h1>
      <p className="subtitle">Convert your titles to any capitalization style</p>

      <div className="input-group">
        <label htmlFor="input">Paste your title:</label>
        <textarea
          id="input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g., the quick brown fox jumps over the lazy dog"
        />
      </div>

      <div className="input-group">
        <label>Choose your style:</label>
        <div className="styles-grid">
          {Object.entries(styles).map(([key, style]) => (
            <button
              key={key}
              className={`style-btn ${selectedStyle === key ? 'active' : ''}`}
              onClick={() => setSelectedStyle(key)}
            >
              <span className="name">{style.label}</span>
              <span className="desc">{style.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="output-section">
        <label>Result:</label>
        <div className="output-box">{outputText || '(Your result will appear here)'}</div>
        {outputText && (
          <button
            className={`copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
          </button>
        )}
      </div>

      <div className="features">
        <p>✨ <strong>9 different styles</strong> - Title, AP, Chicago, APA, Sentence, camelCase, PascalCase, and more</p>
        <p>⚡ <strong>Instant results</strong> - Real-time conversion as you type</p>
        <p>🚀 <strong>Free & Fast</strong> - No limits, works offline-ready</p>
      </div>
    </main>
  );
}
