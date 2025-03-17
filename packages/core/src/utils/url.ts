export function buildUrl(baseUrl: string, path: string): string {
  const protocolMatch = baseUrl.match(/^(https?:\/\/)/);
  const protocol = protocolMatch ? protocolMatch[0] : '';
  const restOfBase = baseUrl.replace(/^(https?:\/\/)/, '').replace(/\/$/, '');
  const normalizedPath = path.replace(/^\//, '');

  return `${protocol}${restOfBase}/${normalizedPath}`;
}
