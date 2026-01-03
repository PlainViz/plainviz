/**
 * remark-plainviz
 * A remark plugin to render PlainViz code blocks as SVG charts
 *
 * Usage in Markdown:
 * ```plainviz
 * Type: Bar
 * Title: Sales
 *
 * Q1: 100
 * Q2: 200
 * ```
 */

import type { Root, Code } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { parse } from '@plainviz/core';
import { render } from '@plainviz/render-svg';

export interface RemarkPlainVizOptions {
  /**
   * Class name to add to the SVG wrapper
   * @default 'plainviz-chart'
   */
  className?: string;
}

const remarkPlainViz: Plugin<[RemarkPlainVizOptions?], Root> = (options = {}) => {
  const { className = 'plainviz-chart' } = options;

  return (tree: Root) => {
    visit(tree, 'code', (node: Code, index, parent) => {
      if (node.lang !== 'plainviz' && node.lang !== 'pv') {
        return;
      }

      const result = parse(node.value);

      if (!result.ok) {
        // On error, keep the code block but add error info
        const errorMsg = result.errors
          .map(e => `Line ${e.line}: ${e.message}`)
          .join('\n');

        (node as any).type = 'html';
        (node as any).value = `<pre class="plainviz-error"><code>${errorMsg}</code></pre>`;
        return;
      }

      try {
        const svg = render(result.ir);
        const wrapped = `<div class="${className}">${svg}</div>`;

        (node as any).type = 'html';
        (node as any).value = wrapped;
      } catch (err) {
        (node as any).type = 'html';
        (node as any).value = `<pre class="plainviz-error"><code>Render error: ${(err as Error).message}</code></pre>`;
      }
    });
  };
};

export default remarkPlainViz;
