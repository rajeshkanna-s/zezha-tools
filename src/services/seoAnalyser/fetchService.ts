// CORS proxy fetching + HTML parsing for SEO Analyser

export async function fetchSiteHTML(url: string): Promise<{ html: string; headers: Record<string, string> }> {
  const proxies = [
    { url: `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, type: 'json' as const },
    { url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`, type: 'text' as const },
  ];

  for (const proxy of proxies) {
    try {
      const res = await fetch(proxy.url, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) continue;

      if (proxy.type === 'json') {
        const data = await res.json();
        if (data.contents) {
          return {
            html: data.contents,
            headers: data.status?.response_headers || {},
          };
        }
      } else {
        const text = await res.text();
        if (text) return { html: text, headers: {} };
      }
    } catch {
      continue;
    }
  }
  throw new Error('Unable to fetch the site. It may be blocking proxy access or is down.');
}

export function parseHTML(html: string): Document {
  return new DOMParser().parseFromString(html, 'text/html');
}

export function normalizeUrl(input: string): string {
  let url = input.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return new URL(url).href;
}
