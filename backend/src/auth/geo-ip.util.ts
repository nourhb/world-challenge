const PRIVATE_RANGES = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
  /^localhost$/i,
];

export function normalizeIp(raw: string | undefined): string | null {
  if (!raw) {
    return null;
  }

  const first = raw.split(',')[0]?.trim();
  if (!first) {
    return null;
  }

  return first.replace(/^::ffff:/i, '');
}

export function isPrivateIp(ip: string): boolean {
  return PRIVATE_RANGES.some((pattern) => pattern.test(ip));
}

export function maskIp(ip: string): string {
  if (ip.includes(':')) {
    const parts = ip.split(':').filter(Boolean);
    return parts.length > 0 ? `${parts[0]}:****` : '****';
  }

  const octets = ip.split('.');
  if (octets.length !== 4) {
    return '****';
  }

  return `${octets[0]}.${octets[1]}.x.x`;
}

export function extractClientIp(headers: Record<string, unknown>, remoteAddress?: string): string | null {
  const forwarded = headers['x-forwarded-for'];
  const realIp = headers['x-real-ip'];
  const cfIp = headers['cf-connecting-ip'];

  const candidates = [
    typeof cfIp === 'string' ? cfIp : null,
    typeof realIp === 'string' ? realIp : null,
    typeof forwarded === 'string' ? forwarded : Array.isArray(forwarded) ? forwarded[0] : null,
    remoteAddress ?? null,
  ];

  for (const candidate of candidates) {
    const ip = normalizeIp(candidate ?? undefined);
    if (ip) {
      return ip;
    }
  }

  return null;
}
