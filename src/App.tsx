import { useState, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { parse, DEFAULT_EXAMPLE } from './lib/parser';
import { ChartRenderer } from './components/ChartRenderer';

function App() {
  const [code, setCode] = useState(DEFAULT_EXAMPLE);

  const parseResult = useMemo(() => parse(code), [code]);

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
              const svg = document.querySelector('.recharts-wrapper svg');
              if (svg) {
                const svgData = new XMLSerializer().serializeToString(svg);
                const blob = new Blob([svgData], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'chart.svg';
                a.click();
              }
            }}
            className="px-3 py-1 text-sm bg-[#313244] hover:bg-[#45475a] rounded text-[#cdd6f4] transition-colors"
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
          Type: {parseResult.config.type} | Data points: {parseResult.data.length}
        </span>
        <span>plainviz.com</span>
      </footer>
    </div>
  );
}

export default App;
