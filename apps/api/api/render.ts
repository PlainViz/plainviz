export default function handler(req: any, res: any) {
  const code = req.query.code || req.body?.code;

  if (!code) {
    return res.status(400).json({
      error: 'Missing "code" parameter',
      example: '/api/render?code=Type:Bar%0AApples:50',
    });
  }

  // 简单测试 - 先不导入 @plainviz 包
  res.status(200).json({
    received: code,
    message: 'Test successful'
  });
}
