/**
 * Host Parser Utility
 * Extracts niche information from the Host header.
 */

export type NicheId = string;

export interface HostParseResult {
  niche: NicheId;
  isLocal: boolean;
}

const APEX_NICHE = 'apex';
const APEX_DOMAINS = ['uniteia.com', 'uniteia.local', 'localhost'];

/**
 * Parses the Host header to extract the niche slug.
 * 
 * Logic:
 * 1. Remove port if present (e.g., localhost:3000 -> localhost)
 * 2. If host is in APEX_DOMAINS, return 'apex'
 * 3. If host has a subdomain (e.g., singularity.uniteia.com), return the first part ('singularity')
 * 4. Fallback to 'apex'
 * 
 * @param host The value of the 'Host' header
 * @returns HostParseResult
 */
export function parseHost(host: string | null): HostParseResult {
  if (!host) {
    return { niche: APEX_NICHE, isLocal: false };
  }

  // 1. Remove port
  const hostname = host.split(':')[0] || '';
  const isLocal = hostname === 'localhost' || hostname.endsWith('.local');

  // 2. Check for apex domains
  if (APEX_DOMAINS.includes(hostname)) {
    return { niche: APEX_NICHE, isLocal };
  }

  // 3. Extract subdomain
  // Matches <niche>.<domain>.<tld> or <niche>.<domain>.local
  const parts = hostname.split('.');
  
  if (parts.length >= 3) {
    // Assuming the format is [niche].[domain].[tld]
    // e.g., singularity.uniteia.com -> ['singularity', 'uniteia', 'com']
    return { niche: parts[0] || APEX_NICHE, isLocal };
  }

  return { niche: APEX_NICHE, isLocal };
}
