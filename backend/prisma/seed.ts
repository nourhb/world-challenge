import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { BANK_QUESTIONS, GAME_CATALOG } from './question-bank';

const prisma = new PrismaClient();

interface CountrySeed {
  iso2: string;
  iso3: string;
  name: string;
  officialName: string;
  capital: string;
  continent: string;
  region: string;
  flagEmoji: string;
  latitude: number;
  longitude: number;
  languages: string[];
  currency: string;
  description: string;
}

const countries: CountrySeed[] = [
  { iso2: 'TN', iso3: 'TUN', name: 'Tunisia', officialName: 'Republic of Tunisia', capital: 'Tunis', continent: 'Africa', region: 'Northern Africa', flagEmoji: '🇹🇳', latitude: 33.8869, longitude: 9.5375, languages: ['Arabic', 'French'], currency: 'TND', description: 'North African country on the Mediterranean, known for Carthage, medinas, and a long coastline.' },
  { iso2: 'MA', iso3: 'MAR', name: 'Morocco', officialName: 'Kingdom of Morocco', capital: 'Rabat', continent: 'Africa', region: 'Northern Africa', flagEmoji: '🇲🇦', latitude: 31.7917, longitude: -7.0926, languages: ['Arabic', 'Tamazight', 'French'], currency: 'MAD', description: 'North African kingdom with Atlas mountains, Atlantic and Mediterranean coasts, and historic imperial cities.' },
  { iso2: 'EG', iso3: 'EGY', name: 'Egypt', officialName: 'Arab Republic of Egypt', capital: 'Cairo', continent: 'Africa', region: 'Northern Africa', flagEmoji: '🇪🇬', latitude: 26.8206, longitude: 30.8025, languages: ['Arabic'], currency: 'EGP', description: 'Northeast African country centered on the Nile, with ancient monuments and a Mediterranean coastline.' },
  { iso2: 'ZA', iso3: 'ZAF', name: 'South Africa', officialName: 'Republic of South Africa', capital: 'Pretoria', continent: 'Africa', region: 'Southern Africa', flagEmoji: '🇿🇦', latitude: -30.5595, longitude: 22.9375, languages: ['English', 'Zulu', 'Xhosa', 'Afrikaans'], currency: 'ZAR', description: 'Country at the southern tip of Africa with multiple official languages and varied landscapes.' },
  { iso2: 'KE', iso3: 'KEN', name: 'Kenya', officialName: 'Republic of Kenya', capital: 'Nairobi', continent: 'Africa', region: 'Eastern Africa', flagEmoji: '🇰🇪', latitude: -0.0236, longitude: 37.9062, languages: ['English', 'Swahili'], currency: 'KES', description: 'East African country on the Indian Ocean, known for highland cities and wildlife parks.' },
  { iso2: 'NG', iso3: 'NGA', name: 'Nigeria', officialName: 'Federal Republic of Nigeria', capital: 'Abuja', continent: 'Africa', region: 'Western Africa', flagEmoji: '🇳🇬', latitude: 9.082, longitude: 8.6753, languages: ['English', 'Hausa', 'Yoruba', 'Igbo'], currency: 'NGN', description: 'West African federation and the most populous country in Africa.' },
  { iso2: 'GH', iso3: 'GHA', name: 'Ghana', officialName: 'Republic of Ghana', capital: 'Accra', continent: 'Africa', region: 'Western Africa', flagEmoji: '🇬🇭', latitude: 7.9465, longitude: -1.0232, languages: ['English'], currency: 'GHS', description: 'West African country on the Gulf of Guinea with a long Atlantic coastline.' },
  { iso2: 'ET', iso3: 'ETH', name: 'Ethiopia', officialName: 'Federal Democratic Republic of Ethiopia', capital: 'Addis Ababa', continent: 'Africa', region: 'Eastern Africa', flagEmoji: '🇪🇹', latitude: 9.145, longitude: 40.4897, languages: ['Amharic', 'Oromo'], currency: 'ETB', description: 'East African highland country and one of the oldest states in the region.' },
  { iso2: 'FR', iso3: 'FRA', name: 'France', officialName: 'French Republic', capital: 'Paris', continent: 'Europe', region: 'Western Europe', flagEmoji: '🇫🇷', latitude: 46.2276, longitude: 2.2137, languages: ['French'], currency: 'EUR', description: 'Western European country with Atlantic, Mediterranean, and alpine regions.' },
  { iso2: 'DE', iso3: 'DEU', name: 'Germany', officialName: 'Federal Republic of Germany', capital: 'Berlin', continent: 'Europe', region: 'Western Europe', flagEmoji: '🇩🇪', latitude: 51.1657, longitude: 10.4515, languages: ['German'], currency: 'EUR', description: 'Central European federation of sixteen states.' },
  { iso2: 'IT', iso3: 'ITA', name: 'Italy', officialName: 'Italian Republic', capital: 'Rome', continent: 'Europe', region: 'Southern Europe', flagEmoji: '🇮🇹', latitude: 41.8719, longitude: 12.5674, languages: ['Italian'], currency: 'EUR', description: 'Southern European peninsula in the Mediterranean, including islands such as Sicily and Sardinia.' },
  { iso2: 'ES', iso3: 'ESP', name: 'Spain', officialName: 'Kingdom of Spain', capital: 'Madrid', continent: 'Europe', region: 'Southern Europe', flagEmoji: '🇪🇸', latitude: 40.4637, longitude: -3.7492, languages: ['Spanish'], currency: 'EUR', description: 'Iberian country with Atlantic and Mediterranean coasts and several official regional languages.' },
  { iso2: 'GB', iso3: 'GBR', name: 'United Kingdom', officialName: 'United Kingdom of Great Britain and Northern Ireland', capital: 'London', continent: 'Europe', region: 'Northern Europe', flagEmoji: '🇬🇧', latitude: 55.3781, longitude: -3.436, languages: ['English'], currency: 'GBP', description: 'Island country in northwestern Europe made up of England, Scotland, Wales, and Northern Ireland.' },
  { iso2: 'PT', iso3: 'PRT', name: 'Portugal', officialName: 'Portuguese Republic', capital: 'Lisbon', continent: 'Europe', region: 'Southern Europe', flagEmoji: '🇵🇹', latitude: 39.3999, longitude: -8.2245, languages: ['Portuguese'], currency: 'EUR', description: 'Westernmost country of mainland Europe, on the Atlantic edge of the Iberian Peninsula.' },
  { iso2: 'GR', iso3: 'GRC', name: 'Greece', officialName: 'Hellenic Republic', capital: 'Athens', continent: 'Europe', region: 'Southern Europe', flagEmoji: '🇬🇷', latitude: 39.0742, longitude: 21.8243, languages: ['Greek'], currency: 'EUR', description: 'Southeastern European country of the Balkan Peninsula and many Aegean islands.' },
  { iso2: 'SE', iso3: 'SWE', name: 'Sweden', officialName: 'Kingdom of Sweden', capital: 'Stockholm', continent: 'Europe', region: 'Northern Europe', flagEmoji: '🇸🇪', latitude: 60.1282, longitude: 18.6435, languages: ['Swedish'], currency: 'SEK', description: 'Nordic country on the Scandinavian Peninsula, with a long Baltic coastline.' },
  { iso2: 'PL', iso3: 'POL', name: 'Poland', officialName: 'Republic of Poland', capital: 'Warsaw', continent: 'Europe', region: 'Eastern Europe', flagEmoji: '🇵🇱', latitude: 51.9194, longitude: 19.1451, languages: ['Polish'], currency: 'PLN', description: 'Central European country on the Baltic Sea.' },
  { iso2: 'NL', iso3: 'NLD', name: 'Netherlands', officialName: 'Kingdom of the Netherlands', capital: 'Amsterdam', continent: 'Europe', region: 'Western Europe', flagEmoji: '🇳🇱', latitude: 52.1326, longitude: 5.2913, languages: ['Dutch'], currency: 'EUR', description: 'Low-lying western European country on the North Sea.' },
  { iso2: 'IE', iso3: 'IRL', name: 'Ireland', officialName: 'Ireland', capital: 'Dublin', continent: 'Europe', region: 'Northern Europe', flagEmoji: '🇮🇪', latitude: 53.4129, longitude: -8.2439, languages: ['English', 'Irish'], currency: 'EUR', description: 'Island country in the North Atlantic, west of Great Britain.' },
  { iso2: 'IS', iso3: 'ISL', name: 'Iceland', officialName: 'Iceland', capital: 'Reykjavik', continent: 'Europe', region: 'Northern Europe', flagEmoji: '🇮🇸', latitude: 64.9631, longitude: -19.0208, languages: ['Icelandic'], currency: 'ISK', description: 'Nordic island country in the North Atlantic.' },
  { iso2: 'JP', iso3: 'JPN', name: 'Japan', officialName: 'Japan', capital: 'Tokyo', continent: 'Asia', region: 'Eastern Asia', flagEmoji: '🇯🇵', latitude: 36.2048, longitude: 138.2529, languages: ['Japanese'], currency: 'JPY', description: 'East Asian island country in the Pacific Ocean.' },
  { iso2: 'CN', iso3: 'CHN', name: 'China', officialName: "People's Republic of China", capital: 'Beijing', continent: 'Asia', region: 'Eastern Asia', flagEmoji: '🇨🇳', latitude: 35.8617, longitude: 104.1954, languages: ['Mandarin Chinese'], currency: 'CNY', description: 'East Asian country covering a large part of the Asian mainland.' },
  { iso2: 'IN', iso3: 'IND', name: 'India', officialName: 'Republic of India', capital: 'New Delhi', continent: 'Asia', region: 'Southern Asia', flagEmoji: '🇮🇳', latitude: 20.5937, longitude: 78.9629, languages: ['Hindi', 'English'], currency: 'INR', description: 'South Asian country on the Indian subcontinent.' },
  { iso2: 'KR', iso3: 'KOR', name: 'South Korea', officialName: 'Republic of Korea', capital: 'Seoul', continent: 'Asia', region: 'Eastern Asia', flagEmoji: '🇰🇷', latitude: 35.9078, longitude: 127.7669, languages: ['Korean'], currency: 'KRW', description: 'East Asian country on the southern part of the Korean Peninsula.' },
  { iso2: 'TH', iso3: 'THA', name: 'Thailand', officialName: 'Kingdom of Thailand', capital: 'Bangkok', continent: 'Asia', region: 'South-Eastern Asia', flagEmoji: '🇹🇭', latitude: 15.87, longitude: 100.9925, languages: ['Thai'], currency: 'THB', description: 'Southeast Asian country on the Indochinese and Malay peninsulas.' },
  { iso2: 'VN', iso3: 'VNM', name: 'Vietnam', officialName: 'Socialist Republic of Viet Nam', capital: 'Hanoi', continent: 'Asia', region: 'South-Eastern Asia', flagEmoji: '🇻🇳', latitude: 14.0583, longitude: 108.2772, languages: ['Vietnamese'], currency: 'VND', description: 'Southeast Asian country along the eastern Indochinese Peninsula.' },
  { iso2: 'ID', iso3: 'IDN', name: 'Indonesia', officialName: 'Republic of Indonesia', capital: 'Jakarta', continent: 'Asia', region: 'South-Eastern Asia', flagEmoji: '🇮🇩', latitude: -0.7893, longitude: 113.9213, languages: ['Indonesian'], currency: 'IDR', description: 'Southeast Asian archipelago spanning thousands of islands between the Indian and Pacific Oceans.' },
  { iso2: 'TR', iso3: 'TUR', name: 'Turkey', officialName: 'Republic of Türkiye', capital: 'Ankara', continent: 'Asia', region: 'Western Asia', flagEmoji: '🇹🇷', latitude: 38.9637, longitude: 35.2433, languages: ['Turkish'], currency: 'TRY', description: 'Transcontinental country mainly on the Anatolian peninsula, with a smaller area in southeastern Europe.' },
  { iso2: 'SA', iso3: 'SAU', name: 'Saudi Arabia', officialName: 'Kingdom of Saudi Arabia', capital: 'Riyadh', continent: 'Asia', region: 'Western Asia', flagEmoji: '🇸🇦', latitude: 23.8859, longitude: 45.0792, languages: ['Arabic'], currency: 'SAR', description: 'Country occupying most of the Arabian Peninsula.' },
  { iso2: 'AE', iso3: 'ARE', name: 'United Arab Emirates', officialName: 'United Arab Emirates', capital: 'Abu Dhabi', continent: 'Asia', region: 'Western Asia', flagEmoji: '🇦🇪', latitude: 23.4241, longitude: 53.8478, languages: ['Arabic'], currency: 'AED', description: 'Federation of seven emirates on the Arabian Peninsula.' },
  { iso2: 'CA', iso3: 'CAN', name: 'Canada', officialName: 'Canada', capital: 'Ottawa', continent: 'Americas', region: 'Northern America', flagEmoji: '🇨🇦', latitude: 56.1304, longitude: -106.3468, languages: ['English', 'French'], currency: 'CAD', description: 'North American country stretching from the Atlantic to the Pacific and north to the Arctic.' },
  { iso2: 'US', iso3: 'USA', name: 'United States', officialName: 'United States of America', capital: 'Washington, D.C.', continent: 'Americas', region: 'Northern America', flagEmoji: '🇺🇸', latitude: 37.0902, longitude: -95.7129, languages: ['English'], currency: 'USD', description: 'Federal republic in North America with Pacific, Atlantic, and Gulf coasts.' },
  { iso2: 'MX', iso3: 'MEX', name: 'Mexico', officialName: 'United Mexican States', capital: 'Mexico City', continent: 'Americas', region: 'Central America', flagEmoji: '🇲🇽', latitude: 23.6345, longitude: -102.5528, languages: ['Spanish'], currency: 'MXN', description: 'North American country between the United States and Central America.' },
  { iso2: 'BR', iso3: 'BRA', name: 'Brazil', officialName: 'Federative Republic of Brazil', capital: 'Brasilia', continent: 'Americas', region: 'South America', flagEmoji: '🇧🇷', latitude: -14.235, longitude: -51.9253, languages: ['Portuguese'], currency: 'BRL', description: 'Largest country in South America, covering much of the eastern continent and the Amazon basin.' },
  { iso2: 'AR', iso3: 'ARG', name: 'Argentina', officialName: 'Argentine Republic', capital: 'Buenos Aires', continent: 'Americas', region: 'South America', flagEmoji: '🇦🇷', latitude: -38.4161, longitude: -63.6167, languages: ['Spanish'], currency: 'ARS', description: 'South American country stretching from subtropical north to Tierra del Fuego.' },
  { iso2: 'CL', iso3: 'CHL', name: 'Chile', officialName: 'Republic of Chile', capital: 'Santiago', continent: 'Americas', region: 'South America', flagEmoji: '🇨🇱', latitude: -35.6751, longitude: -71.543, languages: ['Spanish'], currency: 'CLP', description: 'Long, narrow country along the western edge of South America.' },
  { iso2: 'CO', iso3: 'COL', name: 'Colombia', officialName: 'Republic of Colombia', capital: 'Bogota', continent: 'Americas', region: 'South America', flagEmoji: '🇨🇴', latitude: 4.5709, longitude: -74.2973, languages: ['Spanish'], currency: 'COP', description: 'South American country with Caribbean and Pacific coastlines.' },
  { iso2: 'PE', iso3: 'PER', name: 'Peru', officialName: 'Republic of Peru', capital: 'Lima', continent: 'Americas', region: 'South America', flagEmoji: '🇵🇪', latitude: -9.19, longitude: -75.0152, languages: ['Spanish', 'Quechua'], currency: 'PEN', description: 'Western South American country including Andes highlands and Amazon lowlands.' },
  { iso2: 'AU', iso3: 'AUS', name: 'Australia', officialName: 'Commonwealth of Australia', capital: 'Canberra', continent: 'Oceania', region: 'Australia and New Zealand', flagEmoji: '🇦🇺', latitude: -25.2744, longitude: 133.7751, languages: ['English'], currency: 'AUD', description: 'Country occupying the Australian continent and nearby islands.' },
  { iso2: 'NZ', iso3: 'NZL', name: 'New Zealand', officialName: 'New Zealand', capital: 'Wellington', continent: 'Oceania', region: 'Australia and New Zealand', flagEmoji: '🇳🇿', latitude: -40.9006, longitude: 174.886, languages: ['English', 'Maori'], currency: 'NZD', description: 'Island country in the southwestern Pacific Ocean.' },
];

const DEMO_PASSWORD = 'DemoPass123!';

async function main(): Promise<void> {
  for (const country of countries) {
    await prisma.country.upsert({
      where: { iso2: country.iso2 },
      update: {
        ...country,
        flagUrl: `https://flagcdn.com/w320/${country.iso2.toLowerCase()}.png`,
      },
      create: {
        ...country,
        flagUrl: `https://flagcdn.com/w320/${country.iso2.toLowerCase()}.png`,
      },
    });
  }

  for (const game of GAME_CATALOG) {
    await prisma.game.upsert({
      where: { type: game.type },
      update: {
        name: game.name,
        description: game.description,
        isActive: true,
      },
      create: {
        type: game.type,
        name: game.name,
        description: game.description,
        isActive: true,
      },
    });
  }

  const badges = [
    {
      name: 'World Explorer',
      description: 'Unlock 10 countries in your passport.',
      criteriaType: 'COUNTRIES_UNLOCKED',
      criteriaValue: 10,
    },
    {
      name: 'Global Citizen',
      description: 'Unlock 25 countries in your passport.',
      criteriaType: 'COUNTRIES_UNLOCKED',
      criteriaValue: 25,
    },
    {
      name: 'Culture Master',
      description: 'Finish 50 cultural games.',
      criteriaType: 'GAMES_COMPLETED',
      criteriaValue: 50,
    },
    {
      name: 'Quiz Champion',
      description: 'Score a perfect Country Quiz.',
      criteriaType: 'PERFECT_QUIZ',
      criteriaValue: 1,
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: badge,
      create: badge,
    });
  }

  const countryRows = await prisma.country.findMany();
  const byIso = new Map(countryRows.map((row) => [row.iso2, row]));

  for (const question of BANK_QUESTIONS) {
    const country = question.iso2 ? byIso.get(question.iso2) : undefined;
    const existing = await prisma.question.findFirst({
      where: { prompt: question.prompt, gameType: question.gameType },
    });
    const data = {
      gameType: question.gameType,
      countryId: country?.id,
      language: 'en',
      prompt: question.prompt,
      imageUrl: question.imageUrl ?? null,
      options: question.options,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
      explanation: question.explanation,
      isActive: true,
    };
    if (existing) {
      await prisma.question.update({ where: { id: existing.id }, data });
    } else {
      await prisma.question.create({ data });
    }
  }

  const tunisia = byIso.get('TN');
  const japan = byIso.get('JP');
  if (!tunisia || !japan) {
    throw new Error('Tunisia and Japan must exist before demo users can be seeded');
  }

  const passwordHash = await argon2.hash(DEMO_PASSWORD, { type: argon2.argon2id });
  const demoUsers = [
    {
      username: 'Nour',
      email: 'nour@worldchallenge.local',
      countryId: tunisia.id,
      bio: 'From Tunisia. Looking for a 1v1 Country Quiz.',
    },
    {
      username: 'Alex',
      email: 'alex@worldchallenge.local',
      countryId: japan.id,
      bio: 'From Japan. Challenge me and stamp my country.',
    },
  ];

  for (const demo of demoUsers) {
    await prisma.user.upsert({
      where: { email: demo.email },
      update: {
        username: demo.username,
        passwordHash,
        countryId: demo.countryId,
        bio: demo.bio,
        dateOfBirth: new Date('1996-03-15'),
        termsAcceptedAt: new Date(),
        deletedAt: null,
        isSuspended: false,
      },
      create: {
        username: demo.username,
        email: demo.email,
        passwordHash,
        countryId: demo.countryId,
        bio: demo.bio,
        dateOfBirth: new Date('1996-03-15'),
        termsAcceptedAt: new Date(),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
