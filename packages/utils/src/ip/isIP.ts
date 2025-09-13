function isDecimalOctet(value: string): boolean {
  if (value.length === 0 || value.length > 3) {
    return false;
  }
  if (!/^[0-9]+$/.test(value)) {
    return false;
  }
  const num = Number(value);
  return num >= 0 && num <= 255;
}

export function isIPv4(ip: string): boolean {
  if (typeof ip !== 'string') {
    return false;
  }
  if (ip.indexOf(':') !== -1 || ip.indexOf('.') === -1) {
    return false;
  }
  const parts = ip.split('.');
  if (parts.length !== 4) {
    return false;
  }
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!isDecimalOctet(part)) {
      return false;
    }
  }
  return true;
}

function isValidHextet(value: string): boolean {
  if (value.length === 0 || value.length > 4) {
    return false;
  }
  return /^[0-9a-fA-F]{1,4}$/.test(value);
}

export function isIPv6(ip: string): boolean {
  if (typeof ip !== 'string') {
    return false;
  }

  let address = ip;
  const zoneIndex = address.indexOf('%');
  if (zoneIndex !== -1) {
    address = address.substring(0, zoneIndex);
  }

  if (address.length === 0) {
    return false;
  }

  const doubleColonIndex = address.indexOf('::');
  if (doubleColonIndex !== -1) {
    if (address.indexOf('::', doubleColonIndex + 1) !== -1) {
      return false;
    }
  }

  const hasCompression = doubleColonIndex !== -1;
  const [headStr, tailStr] = hasCompression
    ? address.split('::')
    : [address, ''];
  const headParts = headStr.length > 0 ? headStr.split(':') : [];
  const tailParts =
    hasCompression && tailStr.length > 0 ? tailStr.split(':') : [];

  // In uncompressed form, empty parts are not allowed
  if (!hasCompression) {
    if (headParts.some((p) => p.length === 0)) {
      return false;
    }
  }

  const combinedParts = hasCompression
    ? [...headParts, ...tailParts]
    : headParts;
  let totalHextets = 0;

  for (let i = 0; i < combinedParts.length; i++) {
    const part = combinedParts[i];
    if (part.length === 0) {
      // Empty segments only allowed due to '::', which we split out, so reject
      return false;
    }
    if (part.indexOf('.') !== -1) {
      // IPv4 tail must be the very last part
      if (i !== combinedParts.length - 1) {
        return false;
      }
      if (!isIPv4(part)) {
        return false;
      }
      totalHextets += 2; // IPv4 tail counts as two hextets
    } else {
      if (!isValidHextet(part)) {
        return false;
      }
      totalHextets += 1;
    }
  }

  // With '::', provided hextets must be less than 8 (at least one group compressed)
  if (hasCompression) {
    return totalHextets < 8;
  }

  // Without '::', must have exactly 8 hextets
  return totalHextets === 8;
}

export function isIP(ip: string): number {
  if (isIPv4(ip)) {
    return 4;
  }
  if (isIPv6(ip)) {
    return 6;
  }
  return 0;
}
