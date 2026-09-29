import { extractClientIp, isPrivateIp, maskIp, normalizeIp } from './geo-ip.util';

describe('geo-ip.util', () => {
  it('reads the first forwarded address', () => {
    expect(
      extractClientIp({ 'x-forwarded-for': '197.1.2.3, 10.0.0.1' }, '127.0.0.1'),
    ).toBe('197.1.2.3');
  });

  it('strips IPv4-mapped IPv6 prefixes', () => {
    expect(normalizeIp('::ffff:8.8.8.8')).toBe('8.8.8.8');
  });

  it('detects private addresses', () => {
    expect(isPrivateIp('127.0.0.1')).toBe(true);
    expect(isPrivateIp('192.168.1.20')).toBe(true);
    expect(isPrivateIp('8.8.8.8')).toBe(false);
  });

  it('masks IPv4 for the client', () => {
    expect(maskIp('197.14.22.91')).toBe('197.14.x.x');
  });
});
