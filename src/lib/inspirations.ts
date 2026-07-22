// Daily inspiration for the Today View — scripture (World English Bible, public
// domain) and motivating quotes. Defaults live in code; an admin can override
// the whole set via the `inspirations` site_content doc. Rotated deterministically
// by date so everyone's "verse of the day" is stable all day.

export interface Inspiration {
  text: string;
  attribution: string;
}

export const VERSES: Inspiration[] = [
  { text: "Commit your deeds to Yahweh, and your plans shall succeed.", attribution: "Proverbs 16:3 (WEB)" },
  { text: "Whatever you do, work heartily, as for the Lord, and not for men.", attribution: "Colossians 3:23 (WEB)" },
  { text: "I can do all things through Christ, who strengthens me.", attribution: "Philippians 4:13 (WEB)" },
  { text: "The plans of the diligent surely lead to profit.", attribution: "Proverbs 21:5 (WEB)" },
  { text: "Let us not be weary in doing good, for we will reap in due season if we don't give up.", attribution: "Galatians 6:9 (WEB)" },
  { text: "Be strong and courageous. Don't be afraid, for Yahweh your God is with you wherever you go.", attribution: "Joshua 1:9 (WEB)" },
  { text: "Establish the work of our hands for us. Yes, establish the work of our hands.", attribution: "Psalm 90:17 (WEB)" },
  { text: "Those who wait for Yahweh will renew their strength. They will run and not be weary.", attribution: "Isaiah 40:31 (WEB)" },
  { text: "But seek first God's Kingdom and his righteousness, and all these things will be given to you as well.", attribution: "Matthew 6:33 (WEB)" },
  { text: "Whatever your hand finds to do, do it with your might.", attribution: "Ecclesiastes 9:10 (WEB)" },
  { text: "Trust in Yahweh with all your heart, and don't lean on your own understanding.", attribution: "Proverbs 3:5 (WEB)" },
  { text: "Commit your way to Yahweh. Trust also in him, and he will do this.", attribution: "Psalm 37:5 (WEB)" },
];

export const QUOTES: Inspiration[] = [
  { text: "The way to get started is to quit talking and begin doing.", attribution: "Walt Disney" },
  { text: "Discipline equals freedom.", attribution: "Jocko Willink" },
  { text: "It always seems impossible until it's done.", attribution: "Nelson Mandela" },
  { text: "Well done is better than well said.", attribution: "Benjamin Franklin" },
  { text: "The secret of getting ahead is getting started.", attribution: "Mark Twain" },
  { text: "Do the hard jobs first. The easy jobs will take care of themselves.", attribution: "Dale Carnegie" },
  { text: "Amateurs sit and wait for inspiration; the rest of us just get up and go to work.", attribution: "Stephen King" },
  { text: "Action is the foundational key to all success.", attribution: "Pablo Picasso" },
  { text: "You don't have to be great to start, but you have to start to be great.", attribution: "Zig Ziglar" },
  { text: "Motivation gets you going, but discipline keeps you growing.", attribution: "John C. Maxwell" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", attribution: "Winston Churchill" },
  { text: "Little by little, one travels far.", attribution: "J.R.R. Tolkien" },
];

export function todayKey(timezone = "America/Toronto"): string {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function dayIndex(dateKey: string, len: number): number {
  if (!len) return 0;
  let h = 0;
  for (let i = 0; i < dateKey.length; i++) h = (h * 31 + dateKey.charCodeAt(i)) >>> 0;
  return h % len;
}

export function verseForDay(dateKey: string, verses: Inspiration[] = VERSES): Inspiration {
  const list = verses.length ? verses : VERSES;
  return list[dayIndex(dateKey, list.length)];
}

export function quoteForDay(dateKey: string, quotes: Inspiration[] = QUOTES): Inspiration {
  const list = quotes.length ? quotes : QUOTES;
  return list[dayIndex(dateKey, list.length)];
}

// Parse an admin doc where each entry is `VERSE: "text" attribution` or
// `QUOTE: "text" author`, one per line. Falls back to the built-in sets.
export function parseInspirations(body: string): { verses: Inspiration[]; quotes: Inspiration[] } {
  const verses: Inspiration[] = [];
  const quotes: Inspiration[] = [];
  for (const raw of (body || "").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(/^(VERSE|QUOTE):\s*"([^"]+)"\s*(.*)$/i);
    if (!m) continue;
    const item = { text: m[2].trim(), attribution: (m[3] || "").trim() };
    if (m[1].toUpperCase() === "VERSE") verses.push(item);
    else quotes.push(item);
  }
  return { verses: verses.length ? verses : VERSES, quotes: quotes.length ? quotes : QUOTES };
}

export function serializeInspirations(verses = VERSES, quotes = QUOTES): string {
  return [
    ...verses.map((v) => `VERSE: "${v.text}" ${v.attribution}`),
    "",
    ...quotes.map((q) => `QUOTE: "${q.text}" ${q.attribution}`),
  ].join("\n");
}
