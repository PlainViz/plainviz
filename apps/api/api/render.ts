import { parse } from '@plainviz/core';
import { render } from '@plainviz/render-svg';

export default function handler(req: any, res: any) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get code from query or body
  let code: string | undefined;
  if (req.method === 'GET') {
    code = req.query.code as string;
  } else if (req.method === 'POST') {
    code = req.body?.code;
  }

  if (!code) {
    return res.status(400).json({
      error: 'Missing "code" parameter',
      example: '/api/render?code=Type:Bar%0AApples:50%0AOranges:30',
    });
  }

  // Decode if URL encoded
  try {
    code = decodeURIComponent(code);
  } catch {
    // Already decoded
  }

  // Parse PlainViz code
  const result = parse(code);

  if (!result.ok) {
    return res.status(400).json({
      error: 'Parse error',
      errors: result.errors,
    });
  }

  // Get optional parameters
  const width = parseInt(req.query.width as string) || 500;
  const height = parseInt(req.query.height as string) || 300;
  const theme = req.query.theme as string;

  // Render options
  const options: Record<string, unknown> = { width, height };

  if (theme === 'light') {
    options.backgroundColor = '#ffffff';
    options.textColor = '#1e1e2e';
    options.gridColor = '#e0e0e0';
  }

  // Render SVG
  try {
    const svg = render(result.ir, options);
    const format = req.query.format as string;

    if (format === 'json') {
      return res.status(200).json({ svg, ir: result.ir });
    }

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(svg);
  } catch (error) {
    return res.status(500).json({
      error: 'Render error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
