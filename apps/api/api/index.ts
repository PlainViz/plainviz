export default function handler(req: any, res: any) {
  res.status(200).json({
    name: 'PlainViz API',
    version: '0.1.0',
    status: 'ok'
  });
}
