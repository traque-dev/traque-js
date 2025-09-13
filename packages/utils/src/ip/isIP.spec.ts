import { describe, it, expect } from 'vitest';
import { isIP, isIPv4, isIPv6 } from './isIP';

describe('isIPv4', () => {
  it('accepts valid IPv4', () => {
    expect(isIPv4('0.0.0.0')).toBe(true);
    expect(isIPv4('127.0.0.1')).toBe(true);
    expect(isIPv4('255.255.255.255')).toBe(true);
    expect(isIPv4('192.168.1.1')).toBe(true);
  });

  it('rejects invalid IPv4', () => {
    expect(isIPv4('')).toBe(false);
    expect(isIPv4('256.0.0.1')).toBe(false);
    expect(isIPv4('1.2.3')).toBe(false);
    expect(isIPv4('1.2.3.4.5')).toBe(false);
    expect(isIPv4('1.2.3.a')).toBe(false);
    expect(isIPv4('1.2.3.-1')).toBe(false);
    expect(isIPv4('01.2.3.4')).toBe(true); // Node treats leading zeros as decimal
    expect(isIPv4('1.2.3.4:80')).toBe(false);
  });
});

describe('isIPv6', () => {
  it('accepts valid IPv6 full form', () => {
    expect(isIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
  });

  it('accepts compressed IPv6', () => {
    expect(isIPv6('2001:db8::8a2e:370:7334')).toBe(true);
    expect(isIPv6('::1')).toBe(true);
    expect(isIPv6('::')).toBe(true);
  });

  it('accepts IPv6 with IPv4 tail', () => {
    expect(isIPv6('::ffff:127.0.0.1')).toBe(true);
    expect(isIPv6('2001:db8:0:0:0:0:13.1.68.3')).toBe(true);
  });

  it('accepts IPv6 with zone index', () => {
    expect(isIPv6('fe80::1%lo0')).toBe(true);
  });

  it('rejects invalid IPv6', () => {
    expect(isIPv6('2001:::1')).toBe(false); // multiple ::
    expect(isIPv6('2001:db8::g1')).toBe(false); // invalid hex
    expect(isIPv6('2001:db8:85a3:0:0:8a2e:370:7334:1234')).toBe(false); // too many parts
    expect(isIPv6('::ffff:127.0.0.1:80')).toBe(false); // trailing port
  });
});

describe('isIP', () => {
  it('returns 4 for IPv4', () => {
    expect(isIP('127.0.0.1')).toBe(4);
  });
  it('returns 6 for IPv6', () => {
    expect(isIP('::1')).toBe(6);
    expect(isIP('::ffff:127.0.0.1')).toBe(6);
  });
  it('returns 0 for invalid', () => {
    expect(isIP('')).toBe(0);
    expect(isIP('999.999.999.999')).toBe(0);
    expect(isIP('2001:::1')).toBe(0);
  });
});
