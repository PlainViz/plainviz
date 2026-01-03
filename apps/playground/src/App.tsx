import { useState, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { parse } from '@plainviz/core';
import { render } from '@plainviz/render-svg';
import { ChartRenderer } from './components/ChartRenderer';

const DEFAULT_EXAMPLE = `Type: Bar
Title: Q1 Revenue

Product A: 500
Product B: 750
Product C: 300
Product D: 420`;

function App() {
  const [code, setCode] = useState(DEFAULT_EXAMPLE);

  const parseResult = useMemo(() => parse(code), [code]);

  const svgString = useMemo(() => {
    if (parseResult.ok) {
      try {
        return render(parseResult.ir);
      } catch {
        return null;
      }
    }
    return null;
  }, [parseResult]);

  return (
    <div className="h-full flex flex-col bg-[#1e1e2e]">
      {/* Header */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-[#313244]">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-[#cba6f7]">PlainViz</span>
          <span className="text-xs text-[#6c7086]">v0.1</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (svgString) {
                const blob = new Blob([svgString], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'chart.svg';
                a.click();
                URL.revokeObjectURL(url);
              }
            }}
            disabled={!svgString}
            className="px-3 py-1 text-sm bg-[#313244] hover:bg-[#45475a] rounded text-[#cdd6f4] transition-colors disabled:opacity-50"
          >
            Export SVG
          </button>
          <button
            onClick={() => {
              const encoded = btoa(encodeURIComponent(code));
              const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
              navigator.clipboard.writeText(url);
              alert('Link copied to clipboard!');
            }}
            className="px-3 py-1 text-sm bg-[#89b4fa] hover:bg-[#74c7ec] rounded text-[#1e1e2e] font-medium transition-colors"
          >
            Share
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className="w-1/2 border-r border-[#313244]">
          <div className="h-8 flex items-center px-3 border-b border-[#313244] bg-[#181825]">
            <span className="text-xs text-[#6c7086]">plainviz</span>
          </div>
          <Editor
            height="calc(100% - 2rem)"
            defaultLanguage="yaml"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              padding: { top: 16 },
            }}
          />
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 flex flex-col">
          <div className="h-8 flex items-center px-3 border-b border-[#313244] bg-[#181825]">
            <span className="text-xs text-[#6c7086]">preview</span>
          </div>
          <div className="flex-1 p-4">
            <ChartRenderer result={parseResult} />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <footer className="h-6 flex items-center justify-between px-3 border-t border-[#313244] bg-[#181825] text-xs text-[#6c7086]">
        <span>
          {parseResult.ok
            ? `Type: ${parseResult.ir.type} | Data points: ${parseResult.ir.labels.length}`
            : `Errors: ${parseResult.errors.length}`
          }
        </span>
        <span>plainviz.com</span>
      </footer>
    </div>
  );
}

export default App;
