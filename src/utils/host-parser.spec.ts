import { describe, it, expect } from 'vitest';
import { parseHost } from './host-parser';

describe('Host Parser', () => {
  it('should return apex for localhost', () => {
    const result = parseHost('localhost:3000');
    expect(result.niche).toBe('apex');
    expect(result.isLocal).toBe(true);
  });

  it('should return apex for localhost without port', () => {
    const result = parseHost('localhost');
    expect(result.niche).toBe('apex');
    expect(result.isLocal).toBe(true);
  });

  it('should return apex for uniteia.com', () => {
    const result = parseHost('uniteia.com');
    expect(result.niche).toBe('apex');
    expect(result.isLocal).toBe(false);
  });

  it('should return niche for subdomain on uniteia.com', () => {
    const result = parseHost('singularity.uniteia.com');
    expect(result.niche).toBe('singularity');
    expect(result.isLocal).toBe(false);
  });

  it('should return niche for subdomain on uniteia.local', () => {
    const result = parseHost('dev.uniteia.local:3000');
    expect(result.niche).toBe('dev');
    expect(result.isLocal).toBe(true);
  });

  it('should return apex for null or empty host', () => {
    expect(parseHost(null).niche).toBe('apex');
    expect(parseHost('').niche).toBe('apex');
  });

  it('should handle complex local hostnames', () => {
    const result = parseHost('my-niche.uniteia.local');
    expect(result.niche).toBe('my-niche');
    expect(result.isLocal).toBe(true);
  });

  it('should fallback to apex for unknown 2-part domains', () => {
    // Should we support other domains? The spec says uniteia.com
    const result = parseHost('other.com');
    expect(result.niche).toBe('apex');
  });
});
