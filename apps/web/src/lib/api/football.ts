const FOOTBALL_API_KEY = process.env.NEXT_PUBLIC_SPORTMONKS_API_KEY || '';
const FOOTBALL_API_BASE = 'https://api.sportmonks.com/v3/football';

export interface FootballMatch {
  id: number;
  status: 'LIVE' | 'FT' | 'NS' | 'HT' | 'POSTP';
  league: string;
  round: string;
  venue: string;
  date: string;
  team1: { name: string; code: string; flag: string; score: number | null };
  team2: { name: string; code: string; flag: string; score: number | null };
  minute?: number;
}

export async function fetchFootballMatches(): Promise<FootballMatch[]> {
  if (!FOOTBALL_API_KEY) {
    console.warn('[Football] No NEXT_PUBLIC_SPORTMONKS_API_KEY set');
    return [];
  }

  try {
    const res = await fetch(
      `${FOOTBALL_API_BASE}/livescores/inplay?api_token=${FOOTBALL_API_KEY}&include=round;stage;venue;season;state`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.data || !Array.isArray(data.data)) return [];

    return data.data.map((m: any): FootballMatch => {
      const participants = m.participants || [];
      const scores = m.scores || [];
      const state = m.state?.state;

      const getScore = (id: number) => {
        const s = scores.find((s: any) => s.participant_id === id);
        return s ? s.score?.goals ?? s.score : null;
      };

      return {
        id: m.id,
        status: state === 'LIVE' ? 'LIVE' : state === 'HT' ? 'HT' : state === 'FT' ? 'FT' : 'NS',
        league: m.league?.name || 'Unknown',
        round: m.round?.name || '',
        venue: m.venue?.name || '',
        date: m.starting_at || new Date().toISOString(),
        team1: {
          name: participants[0]?.name || 'TBD',
          code: participants[0]?.short_code || 'TBD',
          flag: getFootballFlag(participants[0]?.name),
          score: getScore(participants[0]?.id),
        },
        team2: {
          name: participants[1]?.name || 'TBD',
          code: participants[1]?.short_code || 'TBD',
          flag: getFootballFlag(participants[1]?.name),
          score: getScore(participants[1]?.id),
        },
        minute: m.periods?.[0]?.minutes,
      };
    });
  } catch (err) {
    console.error('[Football] API error:', err);
    return [];
  }
}

function getFootballFlag(teamName: string): string {
  const flags: Record<string, string> = {
    'Argentina': '🇦🇷', 'Brazil': '🇧🇷', 'France': '🇫🇷', 'Germany': '🇩🇪', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'Spain': '🇪🇸', 'Italy': '🇮🇹', 'Portugal': '🇵🇹', 'Netherlands': '🇳🇱', 'Belgium': '🇧🇪',
    'Croatia': '🇭🇷', 'Uruguay': '🇺🇾', 'Mexico': '🇲🇽', 'USA': '🇺🇸', 'Japan': '🇯🇵',
    'South Korea': '🇰🇷', 'Saudi Arabia': '🇸🇦', 'Qatar': '🇶🇦', 'Morocco': '🇲🇦', 'Senegal': '🇸🇳',
    'Tunisia': '🇹🇳', 'Cameroon': '🇨🇲', 'Ghana': '🇬🇭', 'Australia': '🇦🇺', 'Canada': '🇨🇦',
    'Ecuador': '🇪🇨', 'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'Poland': '🇵🇱', 'Denmark': '🇩🇰', 'Switzerland': '🇨🇭',
    'Manchester City': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Arsenal': '🔴', 'Liverpool': '🔴', 'Manchester United': '🔴', 'Chelsea': '🔵',
    'Real Madrid': '⚪', 'Barcelona': '🔵', 'Atletico Madrid': '🔴', 'Bayern Munich': '🔴', 'Borussia Dortmund': '🟡',
    'Paris Saint-Germain': '🔵', 'Juventus': '⚫', 'AC Milan': '🔴', 'Inter Milan': '🔵', 'Napoli': '🔵',
    'Al Nassr': '🟡', 'Al Hilal': '🔵',
  };
  return flags[teamName] || '⚽';
}
