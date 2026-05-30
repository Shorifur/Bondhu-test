const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBanglaNumber(num: number | string): string {
  return String(num)
    .split('')
    .map((ch) => (ch >= '0' && ch <= '9' ? banglaDigits[parseInt(ch)] : ch))
    .join('');
}

const banglaMonths = [
  'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
  'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র',
];

const banglaDays = [
  'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার',
];

/**
 * Approximate Bengali date conversion.
 * Bengali New Year (Pohela Boishakh) typically falls on April 14.
 * This is a simplified conversion for display purposes.
 */
export function toBengaliDate(date: Date | string): {
  dayName: string;
  day: string;
  month: string;
  year: string;
  formatted: string;
} {
  const d = new Date(date);
  const gregDay = d.getDate();
  const gregMonth = d.getMonth(); // 0-11
  const gregYear = d.getFullYear();

  // Bengali New Year starts around April 14
  // If before April 14, Bangla year = gregYear - 1, else gregYear - 1 also works for most cases
  // Actually: if date < April 14, banglaYear = gregYear - 1, else banglaYear = gregYear
  const isBeforeNewYear = gregMonth < 3 || (gregMonth === 3 && gregDay < 14);
  let banglaYear = isBeforeNewYear ? gregYear - 1 : gregYear;

  // Approximate month/day mapping (simplified)
  const monthStarts: number[] = [14, 15, 15, 15, 16, 16, 16, 17, 16, 15, 14, 14]; // approximate start days
  const monthStartMonths: number[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2]; // corresponding Gregorian months

  let banglaMonthIndex = 0;
  let banglaDay = gregDay;

  // Find the Bangla month
  for (let i = 0; i < 12; i++) {
    const startMonth = monthStartMonths[i];
    const startDay = monthStarts[i];
    const nextIndex = (i + 1) % 12;
    const nextStartMonth = monthStartMonths[nextIndex];
    const nextStartDay = monthStarts[nextIndex];

    const currentDate = new Date(gregYear, gregMonth, gregDay);
    const startDate = new Date(
      startMonth < 3 && gregMonth >= 3 ? gregYear : startMonth >= 3 && gregMonth < 3 ? gregYear - 1 : gregYear,
      startMonth,
      startDay,
    );
    let nextYear = nextStartMonth < 3 && gregMonth >= 3 ? gregYear + 1 : nextStartMonth >= 3 && gregMonth < 3 ? gregYear : gregYear;
    if (nextIndex === 0) nextYear++;
    const nextDate = new Date(nextYear, nextStartMonth, nextStartDay);

    if (currentDate >= startDate && currentDate < nextDate) {
      banglaMonthIndex = i;
      const diffTime = currentDate.getTime() - startDate.getTime();
      banglaDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      break;
    }
  }

  const dayName = banglaDays[d.getDay()];
  const month = banglaMonths[banglaMonthIndex];
  const year = toBanglaNumber(banglaYear);

  return {
    dayName,
    day: toBanglaNumber(banglaDay),
    month,
    year,
    formatted: `${dayName}, ${toBanglaNumber(banglaDay)} ${month} ${year}`,
  };
}

export function formatBengaliDateShort(date: Date | string): string {
  const bd = toBengaliDate(date);
  return bd.formatted;
}
