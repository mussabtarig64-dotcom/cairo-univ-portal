import React from 'react';

/**
 * Prepend https:// if the URL doesn't already start with http:// or https://
 */
export function normalizeUrl(url) {
  if (!url || typeof url !== 'string') return url;
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return 'https://' + trimmed;
}

/**
 * Returns true if the value looks like a real external URL (not just a filename)
 */
export function isExternalUrl(val) {
  if (!val || typeof val !== 'string') return false;
  const t = val.trim().toLowerCase();
  return t.startsWith('http://') || t.startsWith('https://') || t.startsWith('www.');
}

/**
 * Converts bare URLs embedded in plain text into clickable <a> React nodes.
 * Returns an array of mixed strings and React elements.
 */
export function linkifyText(text) {
  if (!text) return text;
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (/^(https?:\/\/|www\.)/i.test(part)) {
      const href = normalizeUrl(part);
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#60a5fa', textDecoration: 'underline' }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

