import type { CricketMatch } from '@/components/cricket/LiveScores';

const CRICKET_API_KEY = process.env.NEXT_PUBLIC_CRICKET_API_KEY || '';
const CRICKET_API_BASE = 'https://api.cricapi.com/v1';

/**
 * Fetch live cricket matches from CricAPI.
 * Requires NEXT_PUBLIC_CRICKET_API_KEY in .env
 * Returns empty array if no API key or request fails.
 */
export async function fetchLiveMatches(): Promise<CricketMatch[]> {
  if (!CRICKET_API_KEY) {
    console.warn('[Cricket] No NEXT_PUBLIC_CRICKET_API_KEY set — add it to your .env for live scores');
    return [];
  }

  try {
    const res = await fetch(
      `${CRICKET_API_BASE}/currentMatches?apikey=${CRICKET_API_KEY}&offset=0`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      return [];
    }

    return data.data
      .filter((m: any) => m.teams?.some((t: string) => t.toLowerCase().includes('bangladesh')))
      .map((m: any): CricketMatch => ({
        id: m.id || String(Math.random()),
        series: m.series_id || 'International',
        team1: {
          name: m.teams?.[0] || 'TBD',
          code: m.teams?.[0]?.slice(0, 3).toUpperCase() || 'TBD',
          flag: getFlag(m.teams?.[0]),
          score: m.score?.[0]?.r ? `${m.score[0].r}/${m.score[0].w}` : '',
          overs: m.score?.[0]?.o ? String(m.score[0].o) : '',
        },
        team2: {
          name: m.teams?.[1] || 'TBD',
          code: m.teams?.[1]?.slice(0, 3).toUpperCase() || 'TBD',
          flag: getFlag(m.teams?.[1]),
          score: m.score?.[1]?.r ? `${m.score[1].r}/${m.score[1].w}` : '',
          overs: m.score?.[1]?.o ? String(m.score[1].o) : '',
        },
        status: m.status?.toLowerCase().includes('live') ? 'LIVE' : m.status?.toLowerCase().includes('result') ? 'RESULT' : 'UPCOMING',
        matchType: m.matchType?.toUpperCase() || 'T20',
        venue: m.venue || '',
        date: m.dateTimeGMT || new Date().toISOString(),
        result: m.status,
      }));
  } catch (err) {
    console.error('[Cricket] API error:', err);
    return [];
  }
}

function getFlag(teamName: string): string {
  const flags: Record<string, string> = {
    'Bangladesh': '🇧🇩', 'India': '🇮🇳', 'Pakistan': '🇵🇰', 'Sri Lanka': '🇱🇰',
    'Australia': '🇦🇺', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'New Zealand': '🇳🇿', 'South Africa': '🇿🇦',
    'West Indies': '🌴', 'Afghanistan': '🇦🇫', 'Zimbabwe': '🇿🇼', 'Ireland': '🇮🇪',
    'Netherlands': '🇳🇱', 'Nepal': '🇳🇵', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁯󠁿', 'UAE': '🇦🇪',
  };
  return flags[teamName] || '🏏';
}
