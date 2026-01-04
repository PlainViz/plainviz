import { runGuards } from './_middleware.js';

export default function handler(req: any, res: any) {
  // 前置检查: kill switch, 限流
  if (!runGuards(req, res)) {
    return;
  }

  res.status(200).json({
    name: 'PlainViz API',
    version: '0.1.0',
    endpoints: {
      health: {
        method: 'GET',
        url: '/api/health',
        description: 'Health check endpoint',
      },
      render: {
        method: 'GET | POST',
        url: '/api/render',
        params: {
          code: 'PlainViz code (required)',
          width: 'Chart width in pixels (default: 500)',
          height: 'Chart height in pixels (default: 300)',
          theme: 'Color theme: dark | light (default: dark)',
          format: 'Response format: svg | json (default: svg)',
        },
        example: '/api/render?code=Type:Bar%0AApples:50%0AOranges:30',
      },
    },
    docs: 'https://plainviz.com',
  });
}
