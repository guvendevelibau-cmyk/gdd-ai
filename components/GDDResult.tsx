// components/GDDResult.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { GDDResponse } from '@/types/gdd';

interface GDDResultProps {
  result: GDDResponse;
  gameName: string;
  onClose: () => void;
}

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#06b6d4',
    primaryTextColor: '#f1f5f9',
    primaryBorderColor: '#0e7490',
    lineColor: '#64748b',
    secondaryColor: '#7c3aed',
    tertiaryColor: '#1e293b',
    background: '#0f172a',
    mainBkg: '#1e293b',
    nodeBorder: '#06b6d4',
    clusterBkg: '#1e293b',
    clusterBorder: '#334155',
    titleColor: '#f1f5f9',
    edgeLabelBackground: '#1e293b',
  },
});

export default function GDDResult({ result, gameName, onClose }: GDDResultProps) {
  const [activeTab, setActiveTab] = useState<'document' | 'flowchart' | 'tables'>('document');
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [mermaidSvg, setMermaidSvg] = useState<string>('');

  // Render Mermaid chart
  useEffect(() => {
    const renderMermaid = async () => {
      if (result.mermaidChartCode && mermaidRef.current) {
        try {
          const { svg } = await mermaid.render('gdd-flowchart', result.mermaidChartCode);
          setMermaidSvg(svg);
        } catch (error) {
          console.error('Mermaid render error:', error);
          setMermaidSvg('<p class="text-red-400">Flowchart render edilemedi.</p>');
        }
      }
    };

    if (activeTab === 'flowchart') {
      renderMermaid();
    }
  }, [result.mermaidChartCode, activeTab]);

  // Download GDD as Markdown
  const downloadMarkdown = () => {
    const blob = new Blob([result.gddText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gameName || 'game'}-gdd.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download as HTML (includes all sections)
  const downloadHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${gameName} - Game Design Document</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #e2e8f0;
      line-height: 1.7;
      padding: 2rem;
      min-height: 100vh;
    }
    .container { max-width: 1000px; margin: 0 auto; }
    h1 { color: #06b6d4; font-size: 2.5rem; margin-bottom: 0.5rem; }
    h2 { color: #22d3ee; font-size: 1.75rem; margin: 2rem 0 1rem; border-bottom: 2px solid #334155; padding-bottom: 0.5rem; }
    h3 { color: #67e8f9; font-size: 1.25rem; margin: 1.5rem 0 0.75rem; }
    p { margin-bottom: 1rem; color: #cbd5e1; }
    ul, ol { margin: 1rem 0; padding-left: 2rem; }
    li { margin-bottom: 0.5rem; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; background: #1e293b; border-radius: 8px; overflow: hidden; }
    th { background: #0f172a; color: #06b6d4; padding: 1rem; text-align: left; font-weight: 600; }
    td { padding: 0.75rem 1rem; border-bottom: 1px solid #334155; }
    tr:hover { background: #334155; }
    .mermaid-container { background: #1e293b; padding: 2rem; border-radius: 12px; margin: 2rem 0; text-align: center; }
    .section { background: #1e293b; padding: 2rem; border-radius: 12px; margin: 1.5rem 0; border: 1px solid #334155; }
    code { background: #334155; padding: 0.2rem 0.5rem; border-radius: 4px; font-family: 'Fira Code', monospace; }
    strong { color: #f1f5f9; }
    .header { text-align: center; margin-bottom: 3rem; padding: 2rem; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; border: 1px solid #334155; }
    .badge { display: inline-block; background: #06b6d4; color: #0f172a; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; margin: 0.25rem; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <script>mermaid.initialize({startOnLoad:true, theme:'dark'});</script>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${gameName}</h1>
      <p style="color: #94a3b8; font-size: 1.125rem;">Game Design Document</p>
      <p style="color: #64748b; font-size: 0.875rem; margin-top: 1rem;">Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}</p>
    </div>
    
    <div class="section">
      ${result.gddText.replace(/^# .+\n/, '').replace(/## /g, '</div><div class="section"><h2>').replace(/### /g, '<h3>').replace(/\n\n/g, '</p><p>').replace(/\n- /g, '</p><ul><li>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}
    </div>
    
    <h2>📊 Oyun Akış Şeması</h2>
    <div class="mermaid-container">
      <div class="mermaid">
${result.mermaidChartCode}
      </div>
    </div>
    
    <h2>📈 Dengeleme Tabloları</h2>
    <div class="section">
      ${result.mathTableHTML}
    </div>
    
    <footer style="text-align: center; margin-top: 3rem; padding: 2rem; color: #64748b; border-top: 1px solid #334155;">
      <p>GDD Generator ile oluşturuldu</p>
    </footer>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gameName || 'game'}-gdd.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Simple Markdown to HTML converter
  const renderMarkdown = (text: string) => {
    return text
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-cyan-400 mt-6 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-cyan-300 mt-8 mb-4 pb-2 border-b border-slate-700">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-cyan-200 mb-6">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-100">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="text-slate-300">$1</em>')
      .replace(/^- (.+)$/gm, '<li class="ml-4 text-slate-300">$1</li>')
      .replace(/\n\n/g, '</p><p class="text-slate-300 mb-4">')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-900/80">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {gameName} - GDD
            </h2>
            <p className="text-sm text-slate-400 mt-1">Game Design Document başarıyla oluşturuldu!</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={downloadMarkdown}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
            >
              📄 Markdown
            </button>
            <button
              onClick={downloadHTML}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-colors"
            >
              📥 HTML İndir
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 bg-slate-800/50">
          {[
            { id: 'document', label: '📝 Doküman', icon: '📝' },
            { id: 'flowchart', label: '📊 Akış Şeması', icon: '📊' },
            { id: 'tables', label: '📈 Tablolar', icon: '📈' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'document' && (
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(result.gddText) }}
            />
          )}

          {activeTab === 'flowchart' && (
            <div className="flex flex-col items-center">
              <div 
                ref={mermaidRef}
                className="bg-slate-800/50 rounded-xl p-8 w-full overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: mermaidSvg }}
              />
              <p className="text-sm text-slate-500 mt-4">
                Oyun akış şeması - Core loop ve sistem etkileşimleri
              </p>
            </div>
          )}

          {activeTab === 'tables' && (
            <div className="space-y-6">
              <div 
                className="bg-slate-800/50 rounded-xl p-6 overflow-x-auto [&_table]:w-full [&_table]:border-collapse [&_th]:bg-slate-700 [&_th]:text-cyan-400 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold [&_td]:px-4 [&_td]:py-3 [&_td]:border-b [&_td]:border-slate-700 [&_tr:hover]:bg-slate-700/50"
                dangerouslySetInnerHTML={{ __html: result.mathTableHTML }}
              />
              <p className="text-sm text-slate-500">
                Oyun dengeleme tabloları - XP, stat ve progression değerleri
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/50 text-center">
          <p className="text-xs text-slate-500">
            Oluşturulma tarihi: {new Date().toLocaleDateString('tr-TR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
