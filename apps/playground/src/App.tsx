import { useState, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { parse } from '@plainviz/core';
import { render } from '@plainviz/render-svg';
import { ChartRenderer } from './components/ChartRenderer';

const EXAMPLES = {
  'Bar Chart': `Type: Bar
Title: Why PlainViz?

Simple Syntax: 90
Instant Render: 85
Open Source: 100
No More Excel: 95`,

  'Line Chart': `Type: Line
Title: Monthly Growth

Jan: 20
Feb: 45
Mar: 80
Apr: 60
May: 90`,

  'Pie Chart': `Type: Pie
Title: Market Share

Chrome: 65
Safari: 19
Firefox: 10
Others: 6`,

  'Area Chart': `Type: Area
Title: Revenue Trend

Q1: 100
Q2: 150
Q3: 130
Q4: 200`,

  'Donut Chart': `Type: Donut
Title: Budget Allocation

Engineering: 40
Marketing: 25
Operations: 20
HR: 15`,

  'Multi-Series Bar': `Type: Bar
Title: Company Comparison
Legend: Alibaba, Tencent

Revenue: 100, 80
Profit: 30, 25
Growth: 15, 12`,

  'Multi-Series Line': `Type: Line
Title: Yearly Trends
Legend: 2023, 2024

Q1: 100, 120
Q2: 110, 140
Q3: 130, 160
Q4: 150, 180`,
};

const DEFAULT_EXAMPLE = EXAMPLES['Bar Chart'];

function App() {
  const [code, setCode] = useState(() => {
    // Load from URL hash if present
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        return decodeURIComponent(atob(hash));
      } catch {
        return DEFAULT_EXAMPLE;
      }
    }
    return DEFAULT_EXAMPLE;
  });
  const [showExamples, setShowExamples] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

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
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-[#cba6f7]">PlainViz</span>
          <span className="text-xs text-[#6c7086] hidden sm:inline">The Markdown for Charts</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Examples Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="px-3 py-1 text-sm bg-[#313244] hover:bg-[#45475a] rounded text-[#cdd6f4] transition-colors flex items-center gap-1"
            >
              Examples
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showExamples && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-[#313244] rounded shadow-lg z-10 py-1">
                {Object.keys(EXAMPLES).map((name) => (
                  <button
                    key={name}
                    onClick={() => {
                      setCode(EXAMPLES[name as keyof typeof EXAMPLES]);
                      setShowExamples(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-[#cdd6f4] hover:bg-[#45475a] transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Help Toggle */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className={`px-3 py-1 text-sm rounded transition-colors flex items-center gap-1 ${
              showHelp ? 'bg-[#a6e3a1] text-[#1e1e2e]' : 'bg-[#313244] hover:bg-[#45475a] text-[#cdd6f4]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">Help</span>
          </button>
          {/* Docs Link */}
          <a
            href="https://plainviz.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 text-sm bg-[#313244] hover:bg-[#45475a] rounded text-[#cdd6f4] transition-colors"
          >
            Docs
          </a>
          {/* GitHub Link */}
          <a
            href="https://github.com/nicekate/plainviz"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 text-sm bg-[#313244] hover:bg-[#45475a] rounded text-[#cdd6f4] transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
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
            Export
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
        <div className={`border-r border-[#313244] ${showHelp ? 'w-1/3' : 'w-1/2'} transition-all`}>
          <div className="h-8 flex items-center px-3 border-b border-[#313244] bg-[#181825]">
            <span className="text-xs text-[#6c7086]">editor</span>
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
        <div className={`flex flex-col ${showHelp ? 'w-1/3' : 'w-1/2'} transition-all`}>
          <div className="h-8 flex items-center px-3 border-b border-[#313244] bg-[#181825]">
            <span className="text-xs text-[#6c7086]">preview</span>
          </div>
          <div className="flex-1 p-4">
            <ChartRenderer result={parseResult} />
          </div>
        </div>

        {/* Help Sidebar */}
        {showHelp && (
          <div className="w-1/3 border-l border-[#313244] flex flex-col">
            <div className="h-8 flex items-center justify-between px-3 border-b border-[#313244] bg-[#181825]">
              <span className="text-xs text-[#6c7086]">syntax reference</span>
              <button
                onClick={() => setShowHelp(false)}
                className="text-[#6c7086] hover:text-[#cdd6f4]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 text-sm text-[#cdd6f4]">
              <div className="space-y-4">
                <section>
                  <h3 className="text-[#cba6f7] font-semibold mb-2">Basic Structure</h3>
                  <pre className="bg-[#181825] p-2 rounded text-xs overflow-x-auto">
{`Type: Bar
Title: My Chart

Label1: 100
Label2: 200`}
                  </pre>
                </section>
                <section>
                  <h3 className="text-[#cba6f7] font-semibold mb-2">Chart Types</h3>
                  <ul className="text-xs space-y-1 text-[#a6adc8]">
                    <li><code className="text-[#89b4fa]">Bar</code> - Bar chart</li>
                    <li><code className="text-[#89b4fa]">Line</code> - Line chart</li>
                    <li><code className="text-[#89b4fa]">Pie</code> - Pie chart</li>
                    <li><code className="text-[#89b4fa]">Area</code> - Area chart</li>
                    <li><code className="text-[#89b4fa]">Donut</code> - Donut chart</li>
                  </ul>
                </section>
                <section>
                  <h3 className="text-[#cba6f7] font-semibold mb-2">Multi-Series</h3>
                  <pre className="bg-[#181825] p-2 rounded text-xs overflow-x-auto">
{`Legend: Series A, Series B
Label1: 100, 80
Label2: 150, 120`}
                  </pre>
                </section>
                <section>
                  <h3 className="text-[#cba6f7] font-semibold mb-2">Value Formats</h3>
                  <ul className="text-xs space-y-1 text-[#a6adc8]">
                    <li><code className="text-[#a6e3a1]">100</code> - Number</li>
                    <li><code className="text-[#a6e3a1]">$1,200</code> - Currency (auto-cleaned)</li>
                    <li><code className="text-[#a6e3a1]">45%</code> - Percentage (auto-cleaned)</li>
                    <li><code className="text-[#6c7086]">// comment</code> - Ignored</li>
                  </ul>
                </section>
                <section>
                  <h3 className="text-[#cba6f7] font-semibold mb-2">API</h3>
                  <p className="text-xs text-[#a6adc8] mb-2">Render charts via URL:</p>
                  <pre className="bg-[#181825] p-2 rounded text-xs overflow-x-auto break-all">
{`https://api.plainviz.com/api/render?code=Type:Bar%0AApples:50`}
                  </pre>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <footer className="h-6 flex items-center justify-between px-3 border-t border-[#313244] bg-[#181825] text-xs text-[#6c7086]">
        <span>
          {parseResult.ok
            ? `Type: ${parseResult.ir.type} | Data points: ${parseResult.ir.labels.length}`
            : `Errors: ${parseResult.errors.length}`
          }
        </span>
        <span>Open Source</span>
      </footer>
    </div>
  );
}

export default App;
