export interface Festival {
  name: string;
  nameBn: string;
  month: number; // 0-11
  day: number;
  theme: {
    primary: string;
    secondary: string;
    bannerGradient: string;
    textColor: string;
  };
  greeting: string;
  greetingBn: string;
  emoji: string;
}

export const festivals: Festival[] = [
  {
    name: 'Eid ul Fitr',
    nameBn: 'ঈদ উল ফিতর',
    month: 3, // Approximate - varies by lunar calendar, using April as placeholder
    day: 10,
    theme: {
      primary: '#16a34a',
      secondary: '#facc15',
      bannerGradient: 'from-green-600 to-yellow-500',
      textColor: 'text-white',
    },
    greeting: 'Eid Mubarak!',
    greetingBn: 'ঈদ মোবারক!',
    emoji: '🌙',
  },
  {
    name: 'Eid ul Adha',
    nameBn: 'ঈদ উল আযহা',
    month: 5, // Approximate - June/July
    day: 17,
    theme: {
      primary: '#16a34a',
      secondary: '#facc15',
      bannerGradient: 'from-green-700 to-yellow-600',
      textColor: 'text-white',
    },
    greeting: 'Eid Mubarak!',
    greetingBn: 'ঈদ মোবারক!',
    emoji: '🐑',
  },
  {
    name: 'Pohela Boishakh',
    nameBn: 'পহেলা বৈশাখ',
    month: 3,
    day: 14,
    theme: {
      primary: '#dc2626',
      secondary: '#ffffff',
      bannerGradient: 'from-red-600 to-red-400',
      textColor: 'text-white',
    },
    greeting: 'Shubho Noboborsho!',
    greetingBn: 'শুভ নববর্ষ!',
    emoji: '🌸',
  },
  {
    name: 'Durga Puja',
    nameBn: 'দুর্গা পূজা',
    month: 9, // October
    day: 10,
    theme: {
      primary: '#9333ea',
      secondary: '#fbbf24',
      bannerGradient: 'from-purple-700 to-orange-500',
      textColor: 'text-white',
    },
    greeting: 'Shubho Bijoya!',
    greetingBn: 'শুভ বিজয়া!',
    emoji: '🪔',
  },
  {
    name: 'Pohela Falgun',
    nameBn: 'পহেলা ফাল্গুন',
    month: 1,
    day: 14,
    theme: {
      primary: '#db2777',
      secondary: '#facc15',
      bannerGradient: 'from-pink-500 to-yellow-400',
      textColor: 'text-white',
    },
    greeting: 'Happy Spring!',
    greetingBn: 'শুভ বসন্ত!',
    emoji: '🌺',
  },
  {
    name: 'Victory Day',
    nameBn: 'বিজয় দিবস',
    month: 11,
    day: 16,
    theme: {
      primary: '#16a34a',
      secondary: '#dc2626',
      bannerGradient: 'from-green-700 to-red-600',
      textColor: 'text-white',
    },
    greeting: 'Joy Bangla!',
    greetingBn: 'জয় বাংলা!',
    emoji: '🇧🇩',
  },
  {
    name: 'Independence Day',
    nameBn: 'স্বাধীনতা দিবস',
    month: 2,
    day: 26,
    theme: {
      primary: '#16a34a',
      secondary: '#dc2626',
      bannerGradient: 'from-green-600 to-red-500',
      textColor: 'text-white',
    },
    greeting: 'Happy Independence Day!',
    greetingBn: 'স্বাধীনতা দিবসের শুভেচ্ছা!',
    emoji: '🇧🇩',
  },
];

export function getUpcomingFestival(daysWindow = 3): Festival | null {
  const now = new Date();
  const currentYear = now.getFullYear();

  for (const festival of festivals) {
    const festivalDate = new Date(currentYear, festival.month, festival.day);
    const diffTime = festivalDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays <= daysWindow) {
      return festival;
    }
  }

  // Check next year for early January festivals when we're in late December
  for (const festival of festivals) {
    const festivalDate = new Date(currentYear + 1, festival.month, festival.day);
    const diffTime = festivalDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays <= daysWindow) {
      return festival;
    }
  }

  return null;
}

export function getFestivalPostTemplate(festival: Festival): string {
  return `${festival.greetingBn} ${festival.emoji}\n${festival.greeting}`;
}
