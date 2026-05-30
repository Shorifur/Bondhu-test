import type { CricketMatch } from '@/components/cricket/LiveScores';

const CRICKET_API_KEY = process.env.NEXT_PUBLIC_CRICKET_API_KEY || '';
const CRICKET_API_BASE = 'https://api.cricapi.com/v1';

/**
 * Fetch live cricket matches
 * Uses cricapi.com free tier (100 requests/day)
 * Falls back to mock data if no API key
 */
export async function fetchLiveMatches(): Promise<CricketMatch[]> {
  // If no API key, return mock data
  if (!CRICKET_API_KEY) {
    return getMockMatches();
  }

  try {
    const res = await fetch(
      `${CRICKET_API_BASE}/currentMatches?apikey=${CRICKET_API_KEY}&offset=0`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();

    if (!data.data || !Array.isArray(data.data)) {
      return getMockMatches();
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
  } catch {
    return getMockMatches();
  }
}

function getFlag(teamName: string): string {
  const flags: Record<string, string> = {
    'Bangladesh': '🇧🇩',
    'India': '🇮🇳',
    'Pakistan': '🇵🇰',
    'Sri Lanka': '🇱🇰',
    'Australia': '🇦🇺',
    'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'New Zealand': '🇳🇿',
    'South Africa': '🇿🇦',
    'West Indies': '🌴',
    'Afghanistan': '🇦🇫',
    'Zimbabwe': '🇿🇼',
    'Ireland': '🇮🇪',
    'Netherlands': '🇳🇱',
  };
  return flags[teamName] || '🏏';
}

function getMockMatches(): CricketMatch[] {
  return [
    {
      id: '1',
      series: 'Bangladesh vs India - 2nd ODI',
      team1: { name: 'Bangladesh', code: 'BAN', flag: '🇧🇩', score: '246/7', overs: '48.2' },
      team2: { name: 'India', code: 'IND', flag: '🇮🇳', score: '0/0', overs: '0.0' },
      status: 'LIVE',
      matchType: 'ODI',
      venue: 'Sher-e-Bangla Stadium, Dhaka',
      date: new Date().toISOString(),
      result: 'Bangladesh opt to bat',
    },
    {
      id: '2',
      series: 'Bangladesh vs Pakistan - 1st T20I',
      team1: { name: 'Pakistan', code: 'PAK', flag: '🇵🇰', score: '189/5', overs: '20.0' },
      team2: { name: 'Bangladesh', code: 'BAN', flag: '🇧🇩', score: '142/8', overs: '18.4' },
      status: 'RESULT',
      matchType: 'T20I',
      venue: 'Zohur Ahmed Chowdhury Stadium, Chattogram',
      date: new Date(Date.now() - 3 * 86400000).toISOString(),
      result: 'Pakistan won by 47 runs',
    },
    {
      id: '3',
      series: 'Bangladesh vs Sri Lanka - Test Match',
      team1: { name: 'Bangladesh', code: 'BAN', flag: '🇧🇩', score: '', overs: '' },
      team2: { name: 'Sri Lanka', code: 'SL', flag: '🇱🇰', score: '', overs: '' },
      status: 'UPCOMING',
      matchType: 'Test',
      venue: 'Sylhet International Stadium',
      date: new Date(Date.now() + 5 * 86400000).toISOString(),
    },
  ];
}
