/**
 * 统一错误码定义
 */
export const ErrorCodes = {
  // 400 - 客户端请求错误
  BAD_REQUEST: {
    status: 400,
    code: 'BAD_REQUEST',
    message: '请求参数不正确',
  },
  MISSING_PARAM: {
    status: 400,
    code: 'MISSING_PARAM',
    message: '缺少必要参数',
  },
  INVALID_FORMAT: {
    status: 400,
    code: 'INVALID_FORMAT',
    message: '请求格式不正确',
  },

  // 422 - 业务逻辑错误
  PARSE_ERROR: {
    status: 422,
    code: 'PARSE_ERROR',
    message: '代码解析失败',
  },
  RENDER_ERROR: {
    status: 422,
    code: 'RENDER_ERROR',
    message: '渲染失败',
  },

  // 429 - 限流
  RATE_LIMITED: {
    status: 429,
    code: 'RATE_LIMITED',
    message: '请求过于频繁，请稍后再试',
  },

  // 413 - Payload 过大
  PAYLOAD_TOO_LARGE: {
    status: 413,
    code: 'PAYLOAD_TOO_LARGE',
    message: '请求体积过大',
  },

  // 500 - 服务器错误
  INTERNAL_ERROR: {
    status: 500,
    code: 'INTERNAL_ERROR',
    message: '服务器内部错误',
  },

  // 503 - 服务不可用 (kill switch)
  SERVICE_UNAVAILABLE: {
    status: 503,
    code: 'SERVICE_UNAVAILABLE',
    message: '服务暂时不可用，请稍后再试',
  },
} as const;

type ErrorCodeKey = keyof typeof ErrorCodes;

/**
 * 统一错误响应
 */
export function sendError(
  res: any,
  errorKey: ErrorCodeKey,
  details?: { message?: string; errors?: unknown; [key: string]: unknown }
) {
  const errorDef = ErrorCodes[errorKey];
  return res.status(errorDef.status).json({
    error: errorDef.code,
    message: details?.message || errorDef.message,
    ...details,
  });
}

/**
 * 配置项 - 可通过环境变量覆盖
 */
export const Config = {
  // Kill switch - 设为 true 则拒绝所有请求
  KILL_SWITCH: process.env.PLAINVIZ_KILL_SWITCH === 'true',

  // 限流配置 (基于内存的简单限流，适合单实例)
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 分钟
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 次/分钟

  // Payload 大小限制
  MAX_CODE_LENGTH: parseInt(process.env.MAX_CODE_LENGTH || '50000'), // 50KB
  MAX_BODY_SIZE: parseInt(process.env.MAX_BODY_SIZE || '102400'), // 100KB
};

/**
 * 简单的内存限流器 (IP 级别)
 * 注意：Vercel Serverless 是无状态的，此限流仅在单个实例内有效
 * 生产环境建议用 Redis/Upstash 等外部存储
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + Config.RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (record.count >= Config.RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

// 定期清理过期记录 (防止内存泄漏)
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 60000);

/**
 * 获取客户端 IP
 */
export function getClientIP(req: any): string {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

/**
 * 前置检查中间件 - 在 handler 开头调用
 * 返回 true 表示通过，false 表示已返回错误响应
 */
export function runGuards(req: any, res: any): boolean {
  // 1. Kill switch 检查
  if (Config.KILL_SWITCH) {
    sendError(res, 'SERVICE_UNAVAILABLE');
    return false;
  }

  // 2. 限流检查
  const ip = getClientIP(req);
  if (!checkRateLimit(ip)) {
    res.setHeader('Retry-After', '60');
    sendError(res, 'RATE_LIMITED');
    return false;
  }

  // 3. Payload 大小检查 (POST 请求)
  if (req.method === 'POST') {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    if (contentLength > Config.MAX_BODY_SIZE) {
      sendError(res, 'PAYLOAD_TOO_LARGE', {
        message: `请求体积超过限制 (最大 ${Config.MAX_BODY_SIZE} 字节)`,
      });
      return false;
    }
  }

  return true;
}

/**
 * 检查代码长度
 */
export function checkCodeLength(code: string, res: any): boolean {
  if (code.length > Config.MAX_CODE_LENGTH) {
    sendError(res, 'PAYLOAD_TOO_LARGE', {
      message: `代码长度超过限制 (最大 ${Config.MAX_CODE_LENGTH} 字符)`,
    });
    return false;
  }
  return true;
}
