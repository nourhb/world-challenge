export interface CatalogGame {
  type: string;
  name: string;
  description: string;
}

export interface BankQuestion {
  gameType: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  iso2?: string;
  difficulty: number;
  explanation: string;
  imageUrl?: string;
}

export const GAME_CATALOG: CatalogGame[] = [
  {
    type: 'COUNTRY_QUIZ',
    name: 'Country Quiz',
    description:
      'Capitals, flags, currencies, and geographic traps. Fast rounds, server-scored.',
  },
  {
    type: 'GUESS_WORD',
    name: 'Guess the Word',
    description:
      'Decode untranslatable terms and cultural concepts. Distractors are the usual tourist myths.',
  },
  {
    type: 'MYSTERY_CUISINE',
    name: 'Mystery Cuisine',
    description:
      'Techniques, fermentation, and foodways — not “where is pizza from.”',
  },
  {
    type: 'MUSIC',
    name: 'Sound Atlas',
    description:
      'Maqam, raga, instruments, and performance codes from living musical traditions.',
  },
  {
    type: 'WORLD_MAP',
    name: 'World Map',
    description:
      'Drop a pin on the real coordinates. Closer clicks score higher; 500 km is a hit.',
  },
  {
    type: 'MIME',
    name: 'Scene Read',
    description:
      'Read a social scene and name the cultural code being performed. No slapstick.',
  },
  {
    type: 'CULTURE_CODE',
    name: 'Culture Code',
    description:
      'Etiquette, diplomacy, and the rules that get you invited back — or shown the door.',
  },
  {
    type: 'HISTORY_CLASH',
    name: 'History Clash',
    description:
      'Turning points, treaties, and revolutions. Dates and causes, not trivia slogans.',
  },
];

export const BANK_QUESTIONS: BankQuestion[] = [
  // Country Quiz — keep the working set, then raise the ceiling
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Which country has Tokyo as its capital?',
    options: ['Japan', 'China', 'South Korea', 'Thailand'],
    correctAnswer: 'Japan',
    iso2: 'JP',
    difficulty: 1,
    explanation: 'Tokyo is the capital of Japan.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'What is the capital of Tunisia?',
    options: ['Tunis', 'Sfax', 'Cairo', 'Algiers'],
    correctAnswer: 'Tunis',
    iso2: 'TN',
    difficulty: 1,
    explanation: 'Tunis is the capital of Tunisia.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Which country is shown by this flag?',
    options: ['Japan', 'China', 'South Korea', 'Vietnam'],
    correctAnswer: 'Japan',
    iso2: 'JP',
    difficulty: 1,
    explanation: 'The Hinomaru is the national flag of Japan.',
    imageUrl: 'https://flagcdn.com/w320/jp.png',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Which country has Paris as its capital?',
    options: ['France', 'Belgium', 'Switzerland', 'Canada'],
    correctAnswer: 'France',
    iso2: 'FR',
    difficulty: 1,
    explanation: 'Paris is the capital of France.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Brasilia is the capital of which country?',
    options: ['Brazil', 'Argentina', 'Portugal', 'Colombia'],
    correctAnswer: 'Brazil',
    iso2: 'BR',
    difficulty: 2,
    explanation: 'Brasilia became Brazil’s capital in 1960.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Which of these countries is an island nation in East Asia?',
    options: ['Japan', 'India', 'Thailand', 'Vietnam'],
    correctAnswer: 'Japan',
    iso2: 'JP',
    difficulty: 1,
    explanation: 'Japan is an archipelago in the Pacific Ocean.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'What is the capital of Canada?',
    options: ['Ottawa', 'Toronto', 'Montreal', 'Vancouver'],
    correctAnswer: 'Ottawa',
    iso2: 'CA',
    difficulty: 2,
    explanation: 'Ottawa, not Toronto, is Canada’s capital.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Which country is on the African continent?',
    options: ['Kenya', 'Japan', 'France', 'Brazil'],
    correctAnswer: 'Kenya',
    iso2: 'KE',
    difficulty: 1,
    explanation: 'Kenya is in East Africa.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'What is the capital of Egypt?',
    options: ['Cairo', 'Alexandria', 'Tunis', 'Rabat'],
    correctAnswer: 'Cairo',
    iso2: 'EG',
    difficulty: 1,
    explanation: 'Cairo is the capital of Egypt.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Which country uses the yen (JPY)?',
    options: ['Japan', 'China', 'South Korea', 'Thailand'],
    correctAnswer: 'Japan',
    iso2: 'JP',
    difficulty: 2,
    explanation: 'The yen is the official currency of Japan.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Rome is the capital of which country?',
    options: ['Italy', 'Greece', 'Spain', 'France'],
    correctAnswer: 'Italy',
    iso2: 'IT',
    difficulty: 1,
    explanation: 'Rome is the capital of Italy.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Which country is in South America?',
    options: ['Chile', 'Spain', 'Morocco', 'Thailand'],
    correctAnswer: 'Chile',
    iso2: 'CL',
    difficulty: 1,
    explanation: 'Chile runs along the western edge of South America.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'What is the capital of Australia?',
    options: ['Canberra', 'Sydney', 'Melbourne', 'Auckland'],
    correctAnswer: 'Canberra',
    iso2: 'AU',
    difficulty: 2,
    explanation: 'Canberra, not Sydney, is Australia’s capital.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Which country’s flag is shown?',
    options: ['Tunisia', 'Turkey', 'Morocco', 'Egypt'],
    correctAnswer: 'Tunisia',
    iso2: 'TN',
    difficulty: 2,
    explanation:
      'Tunisia’s flag is red with a white disk and a red crescent and star.',
    imageUrl: 'https://flagcdn.com/w320/tn.png',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Berlin is the capital of which country?',
    options: ['Germany', 'Austria', 'Netherlands', 'Poland'],
    correctAnswer: 'Germany',
    iso2: 'DE',
    difficulty: 1,
    explanation: 'Berlin is the capital of Germany.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Which country is in Oceania?',
    options: ['New Zealand', 'Japan', 'Chile', 'Portugal'],
    correctAnswer: 'New Zealand',
    iso2: 'NZ',
    difficulty: 1,
    explanation: 'New Zealand is in the southwestern Pacific.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'What is the capital of Morocco?',
    options: ['Rabat', 'Casablanca', 'Marrakesh', 'Tunis'],
    correctAnswer: 'Rabat',
    iso2: 'MA',
    difficulty: 2,
    explanation: 'Rabat is the capital of Morocco.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Seoul is the capital of which country?',
    options: ['South Korea', 'Japan', 'China', 'Vietnam'],
    correctAnswer: 'South Korea',
    iso2: 'KR',
    difficulty: 1,
    explanation: 'Seoul is the capital of South Korea.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Which country has the Nile running through it?',
    options: ['Egypt', 'Kenya', 'Morocco', 'Spain'],
    correctAnswer: 'Egypt',
    iso2: 'EG',
    difficulty: 2,
    explanation: 'The Nile flows north through Egypt to the Mediterranean.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'What is the capital of India?',
    options: ['New Delhi', 'Mumbai', 'Kolkata', 'Chennai'],
    correctAnswer: 'New Delhi',
    iso2: 'IN',
    difficulty: 2,
    explanation: 'New Delhi is the capital of India.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Which country is shown by this flag?',
    options: ['Brazil', 'Portugal', 'Italy', 'Mexico'],
    correctAnswer: 'Brazil',
    iso2: 'BR',
    difficulty: 1,
    explanation: 'Brazil’s flag is green with a yellow rhombus and a blue globe.',
    imageUrl: 'https://flagcdn.com/w320/br.png',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Madrid is the capital of which country?',
    options: ['Spain', 'Mexico', 'Argentina', 'Portugal'],
    correctAnswer: 'Spain',
    iso2: 'ES',
    difficulty: 1,
    explanation: 'Madrid is the capital of Spain.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Which country has coasts on both the Atlantic and the Mediterranean?',
    options: ['Morocco', 'Japan', 'Kenya', 'Poland'],
    correctAnswer: 'Morocco',
    iso2: 'MA',
    difficulty: 3,
    explanation: 'Morocco has both Atlantic and Mediterranean coastlines.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'What is the capital of Sweden?',
    options: ['Stockholm', 'Oslo', 'Helsinki', 'Copenhagen'],
    correctAnswer: 'Stockholm',
    iso2: 'SE',
    difficulty: 2,
    explanation: 'Stockholm is the capital of Sweden.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Which country has Wellington as its capital?',
    options: ['New Zealand', 'Australia', 'Ireland', 'Iceland'],
    correctAnswer: 'New Zealand',
    iso2: 'NZ',
    difficulty: 2,
    explanation: 'Wellington is the capital of New Zealand.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Addis Ababa is the diplomatic hub of the African Union. Which country is it in?',
    options: ['Ethiopia', 'Kenya', 'Ghana', 'Nigeria'],
    correctAnswer: 'Ethiopia',
    iso2: 'ET',
    difficulty: 3,
    explanation: 'The African Union headquarters are in Addis Ababa, Ethiopia.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Which of these is a transcontinental state with land in both Asia and Europe?',
    options: ['Turkey', 'Egypt', 'Spain', 'Indonesia'],
    correctAnswer: 'Turkey',
    iso2: 'TR',
    difficulty: 3,
    explanation:
      'Most of Türkiye is in Anatolia (Asia); Thrace, including part of Istanbul, is in Europe.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Which South American country administers Rapa Nui / Easter Island?',
    options: ['Chile', 'Peru', 'Argentina', 'Mexico'],
    correctAnswer: 'Chile',
    iso2: 'CL',
    difficulty: 4,
    explanation:
      'Rapa Nui is a special territory of Chile, far west of the mainland in the Pacific.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Which country uses the birr and was never formally colonized as a modern state?',
    options: ['Ethiopia', 'Kenya', 'Ghana', 'Egypt'],
    correctAnswer: 'Ethiopia',
    iso2: 'ET',
    difficulty: 4,
    explanation:
      'Ethiopia kept formal independence through the colonial partition of Africa, aside from a brief Italian occupation (1936–1941). The currency is the birr.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'The Strait of Gibraltar separates Spain from which African country?',
    options: ['Morocco', 'Tunisia', 'Egypt', 'Ghana'],
    correctAnswer: 'Morocco',
    iso2: 'MA',
    difficulty: 3,
    explanation: 'The strait lies between southern Spain and northern Morocco.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Which country is both the most populous in Africa and a federation of 36 states?',
    options: ['Nigeria', 'Ethiopia', 'Egypt', 'South Africa'],
    correctAnswer: 'Nigeria',
    iso2: 'NG',
    difficulty: 3,
    explanation: 'Nigeria is a federation and the most populous African country.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Which official language of Ireland is a Celtic language, not a Germanic one?',
    options: ['Irish (Gaeilge)', 'English', 'Scots', 'Welsh'],
    correctAnswer: 'Irish (Gaeilge)',
    iso2: 'IE',
    difficulty: 3,
    explanation: 'Irish is a Goidelic Celtic language; English is Germanic.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Which country sits on the Malay and Indochinese peninsulas and was never colonized?',
    options: ['Thailand', 'Vietnam', 'Indonesia', 'India'],
    correctAnswer: 'Thailand',
    iso2: 'TH',
    difficulty: 4,
    explanation:
      'Siam/Thailand remained formally independent while neighboring mainland states were colonized.',
  },
  {
    gameType: 'COUNTRY_QUIZ',
    prompt: 'Pretoria, Cape Town, and Bloemfontein share national functions. Which country?',
    options: ['South Africa', 'Kenya', 'Australia', 'Nigeria'],
    correctAnswer: 'South Africa',
    iso2: 'ZA',
    difficulty: 4,
    explanation:
      'South Africa splits executive (Pretoria), legislative (Cape Town), and judicial (Bloemfontein) capitals.',
  },

  // Guess the Word
  {
    gameType: 'GUESS_WORD',
    prompt:
      'A Nguni term often flattened to “humanity.” In practice it names a relational ethic: a person is a person through other people. What word?',
    options: ['Ubuntu', 'Harambee', 'Sisu', 'Aloha'],
    correctAnswer: 'Ubuntu',
    iso2: 'ZA',
    difficulty: 3,
    explanation:
      'Ubuntu (Nguni) is an ethic of mutual personhood, not a generic “be nice” slogan.',
  },
  {
    gameType: 'GUESS_WORD',
    prompt:
      'Portuguese names a longing for something absent that may never return — more than nostalgia. What word?',
    options: ['Saudade', 'Hüzün', 'Sisu', 'Fika'],
    correctAnswer: 'Saudade',
    iso2: 'PT',
    difficulty: 3,
    explanation: 'Saudade is a Portuguese/Brazilian structure of feeling, not simple homesickness.',
  },
  {
    gameType: 'GUESS_WORD',
    prompt:
      'Japanese aesthetic: beauty in impermanence, incompleteness, and the unpolished. Not “minimalism.” What term?',
    options: ['Wabi-sabi', 'Ikigai', 'Kawaii', 'Kaizen'],
    correctAnswer: 'Wabi-sabi',
    iso2: 'JP',
    difficulty: 3,
    explanation: 'Wabi-sabi values transience and humble irregularity, not lifestyle branding.',
  },
  {
    gameType: 'GUESS_WORD',
    prompt:
      'Finnish word for grim, stubborn courage when the odds are ugly — grit with a winter climate. What word?',
    options: ['Sisu', 'Hygge', 'Lagom', 'Janteloven'],
    correctAnswer: 'Sisu',
    iso2: 'SE',
    difficulty: 3,
    explanation:
      'Sisu is Finnish. Sweden is the nearest seeded Nordic neighbor for the passport stamp.',
  },
  {
    gameType: 'GUESS_WORD',
    prompt:
      'Mandarin concept: networks of reciprocal obligation that shape business and family life. What term?',
    options: ['Guanxi', 'Mianzi', 'Keigo', 'Ubuntu'],
    correctAnswer: 'Guanxi',
    iso2: 'CN',
    difficulty: 4,
    explanation: 'Guanxi is relational capital; mianzi is closer to “face.”',
  },
  {
    gameType: 'GUESS_WORD',
    prompt:
      'Hindi/Urdu-adjacent street ingenuity: a improvised fix that works with whatever is at hand. What word?',
    options: ['Jugaad', 'Jugaar as “corruption” only', 'Kaizen', 'Janteloven'],
    correctAnswer: 'Jugaad',
    iso2: 'IN',
    difficulty: 3,
    explanation: 'Jugaad is frugal improvisation; it is not automatically a slur for graft.',
  },
  {
    gameType: 'GUESS_WORD',
    prompt:
      'Swedish coffee-and-pause ritual. It is social infrastructure, not just caffeine. What word?',
    options: ['Fika', 'Hygge', 'Siesta', 'Tertulia'],
    correctAnswer: 'Fika',
    iso2: 'SE',
    difficulty: 2,
    explanation: 'Fika is a scheduled social break; hygge is Danish coziness.',
  },
  {
    gameType: 'GUESS_WORD',
    prompt:
      'Spanish literary/social gathering — conversation as the event, not a side effect of drinks. What word?',
    options: ['Tertulia', 'Fiesta', 'Sobremesa', 'Fika'],
    correctAnswer: 'Tertulia',
    iso2: 'ES',
    difficulty: 4,
    explanation: 'A tertulia is a recurring circle of talk; sobremesa is lingering after a meal.',
  },
  {
    gameType: 'GUESS_WORD',
    prompt:
      'Repairing broken pottery with gold lacquer so the crack becomes the point. What Japanese practice?',
    options: ['Kintsugi', 'Ikebana', 'Origami', 'Sumi-e'],
    correctAnswer: 'Kintsugi',
    iso2: 'JP',
    difficulty: 2,
    explanation: 'Kintsugi treats breakage as history, not a defect to hide.',
  },
  {
    gameType: 'GUESS_WORD',
    prompt:
      'Kenyan call to pull together — used for fundraising, politics, and nation-building rhetoric. What word?',
    options: ['Harambee', 'Ubuntu', 'Ujamaa', 'Sankofa'],
    correctAnswer: 'Harambee',
    iso2: 'KE',
    difficulty: 3,
    explanation: 'Harambee (“all pull together”) is a Kenyan national motto and practice.',
  },
  {
    gameType: 'GUESS_WORD',
    prompt:
      'Istanbul melancholy Pamuk described as a collective, city-scale sadness — not private depression. What word?',
    options: ['Hüzün', 'Saudade', 'Sehnsucht', 'Duende'],
    correctAnswer: 'Hüzün',
    iso2: 'TR',
    difficulty: 4,
    explanation: 'Hüzün in this literary sense is a shared urban mood in Turkish.',
  },
  {
    gameType: 'GUESS_WORD',
    prompt:
      'Nordic social code that punishes standing out: do not think you are better than us. What name?',
    options: ['Janteloven', 'Lagom', 'Sisu', 'Hygge'],
    correctAnswer: 'Janteloven',
    iso2: 'SE',
    difficulty: 4,
    explanation:
      'Janteloven (Law of Jante) is a Scandinavian literary/social critique of self-promotion.',
  },

  // Mystery Cuisine
  {
    gameType: 'MYSTERY_CUISINE',
    prompt:
      'Alkaline soak that unlocks niacin in maize and lets masa hold a tortilla. What process?',
    options: ['Nixtamalization', 'Malting', 'Parboiling', 'Lye pretzels only'],
    correctAnswer: 'Nixtamalization',
    iso2: 'MX',
    difficulty: 4,
    explanation:
      'Nixtamalization (lime or ash) is Mesoamerican; it is why maize diets avoided pellagra.',
  },
  {
    gameType: 'MYSTERY_CUISINE',
    prompt:
      'Japan’s mold that saccharifies rice for sake, miso, and shoyu. What organism group is named in kitchens?',
    options: ['Koji (Aspergillus oryzae)', 'Yeast only', 'Lactobacillus only', 'Penicillium for blue cheese'],
    correctAnswer: 'Koji (Aspergillus oryzae)',
    iso2: 'JP',
    difficulty: 4,
    explanation: 'Koji mold converts starch to sugar before yeast or bacteria take over.',
  },
  {
    gameType: 'MYSTERY_CUISINE',
    prompt:
      'Ethiopian staple: a sour teff flatbread that is both plate and utensil. What is it?',
    options: ['Injera', 'Kitchri', 'Injera is wheat pita', 'Chapati'],
    correctAnswer: 'Injera',
    iso2: 'ET',
    difficulty: 3,
    explanation: 'Injera is fermented teff (or teff blends); the holes come from the batter.',
  },
  {
    gameType: 'MYSTERY_CUISINE',
    prompt:
      'Andean/Pacific method: raw fish “cooked” by acid, not heat. What dish family?',
    options: ['Ceviche', 'Sashimi', 'Escabeche only', 'Gravlax'],
    correctAnswer: 'Ceviche',
    iso2: 'PE',
    difficulty: 3,
    explanation: 'Ceviche relies on citrus denaturation; Peru is a core contemporary center.',
  },
  {
    gameType: 'MYSTERY_CUISINE',
    prompt:
      'Maghrebi stew cooked in a conical earthen pot that recycles steam onto the food. What vessel names the dish?',
    options: ['Tagine', 'Tajine is only a spice mix', 'Couscoussier', 'Dutch oven'],
    correctAnswer: 'Tagine',
    iso2: 'MA',
    difficulty: 3,
    explanation: 'The tagine pot’s cone condenses steam; the word names pot and dish.',
  },
  {
    gameType: 'MYSTERY_CUISINE',
    prompt:
      'Mexican sauce tradition that can take days: chiles, seeds, spices, sometimes chocolate. What family?',
    options: ['Mole', 'Sofrito', 'Roux gravy', 'Pesto'],
    correctAnswer: 'Mole',
    iso2: 'MX',
    difficulty: 3,
    explanation: 'Mole is a family of complex sauces; chocolate is only one branch (e.g. mole poblano).',
  },
  {
    gameType: 'MYSTERY_CUISINE',
    prompt:
      'Korean vegetable ferment whose sour heat comes from lactic acid, not vinegar dumped at the end. What food?',
    options: ['Kimchi', 'Pickled cucumbers only', 'Sauerkraut is identical everywhere', 'Achar'],
    correctAnswer: 'Kimchi',
    iso2: 'KR',
    difficulty: 2,
    explanation: 'Kimchi is a lactic ferment; vinegar shortcuts are a different product.',
  },
  {
    gameType: 'MYSTERY_CUISINE',
    prompt:
      'North African/Berber pasta steamed over a stew, not boiled like Italian pasta. What grain dish?',
    options: ['Couscous', 'Polenta', 'Risotto', 'Bulgur pilaf'],
    correctAnswer: 'Couscous',
    iso2: 'TN',
    difficulty: 3,
    explanation: 'Proper couscous is steamed (often twice) in a couscoussier.',
  },
  {
    gameType: 'MYSTERY_CUISINE',
    prompt:
      'Japanese stock whose savor is glutamate from kombu plus nucleotides from katsuobushi. What name?',
    options: ['Dashi', 'Tonkotsu', 'Pho broth', 'Fond'],
    correctAnswer: 'Dashi',
    iso2: 'JP',
    difficulty: 3,
    explanation: 'Dashi is the umami chassis of much Japanese cooking.',
  },
  {
    gameType: 'MYSTERY_CUISINE',
    prompt:
      'West African / African-diaspora rice-and-grain one-pot. In Senegal a national version is thiéboudienne. What broader family?',
    options: ['Jollof / thieb family', 'Paella only', 'Biryani', 'Gumbo only'],
    correctAnswer: 'Jollof / thieb family',
    iso2: 'GH',
    difficulty: 4,
    explanation:
      'Jollof and Senegalese thieb share a tomato-rice logic; Ghana is a live jollof battlefield.',
  },
  {
    gameType: 'MYSTERY_CUISINE',
    prompt:
      'Vietnamese herb-and-broth balance: the bowl is unfinished until the diner adds herbs, lime, and chile. What dish?',
    options: ['Phở', 'Ramen', 'Laksa', 'Avgolemono'],
    correctAnswer: 'Phở',
    iso2: 'VN',
    difficulty: 2,
    explanation: 'Phở’s table salad is part of the recipe, not garnish theater.',
  },
  {
    gameType: 'MYSTERY_CUISINE',
    prompt:
      'Indonesian/Malay fermented soybean cake with a white mycelium rind — meaty when fried. What is it?',
    options: ['Tempeh', 'Tofu', 'Natto', 'Oncom only'],
    correctAnswer: 'Tempeh',
    iso2: 'ID',
    difficulty: 3,
    explanation: 'Tempeh is whole-bean Rhizopus fermentation, denser than tofu.',
  },

  // Music
  {
    gameType: 'MUSIC',
    prompt:
      'Short-necked, fretless lute central to Arabic, Turkish, and Persian art music. What instrument?',
    options: ['Oud', 'Sitar', 'Guitar', 'Balalaika'],
    correctAnswer: 'Oud',
    iso2: 'EG',
    difficulty: 3,
    explanation: 'The oud is the unfretted ancestor-cousin of the European lute.',
  },
  {
    gameType: 'MUSIC',
    prompt:
      'Javanese/Balinese orchestra of tuned gongs and metallophones with paired tunings that shimmer. What ensemble?',
    options: ['Gamelan', 'Kulintang only', 'Taiko', 'Steel pan band'],
    correctAnswer: 'Gamelan',
    iso2: 'ID',
    difficulty: 3,
    explanation: 'Gamelan uses interlocking parts and intentional tuning beats (ombak).',
  },
  {
    gameType: 'MUSIC',
    prompt:
      'Andalusian song-dance complex: compás, palmas, and cante — not a single “Spanish guitar genre.” What name?',
    options: ['Flamenco', 'Fado', 'Tango', 'Fandango only'],
    correctAnswer: 'Flamenco',
    iso2: 'ES',
    difficulty: 3,
    explanation: 'Flamenco is a family of palos with strict rhythmic cycles.',
  },
  {
    gameType: 'MUSIC',
    prompt:
      'Shona thumb piano whose repertoire is spirit-possession music as much as “folk melody.” What instrument?',
    options: ['Mbira', 'Kalimba toy only', 'Kora', 'Hang drum'],
    correctAnswer: 'Mbira',
    iso2: 'ZA',
    difficulty: 4,
    explanation:
      'Mbira dzavadzimu is a Zimbabwean ritual instrument; South Africa is the nearest seeded neighbor.',
  },
  {
    gameType: 'MUSIC',
    prompt:
      'Arabic modal system: a scale + typical phrases + emotional ethos, not just a Western key. What term?',
    options: ['Maqam', 'Raga only', 'Mode as in Dorian pop', 'Pentatonic blues'],
    correctAnswer: 'Maqam',
    iso2: 'TR',
    difficulty: 4,
    explanation: 'Maqam (and related dastgah/makam) is a modal practice, not a chord scale.',
  },
  {
    gameType: 'MUSIC',
    prompt:
      '21-string West African harp-lute of Mandinka jeliw, played seated with a calabash resonator. What instrument?',
    options: ['Kora', 'Ngoni', 'Oud', 'Harp from Europe'],
    correctAnswer: 'Kora',
    iso2: 'GH',
    difficulty: 3,
    explanation: 'The kora is a jeli instrument; Ghana neighbors the Manding world.',
  },
  {
    gameType: 'MUSIC',
    prompt:
      'Three-string Japanese lute played with a large plectrum, used in kabuki and folk song. What instrument?',
    options: ['Shamisen', 'Koto', 'Shakuhachi', 'Erhu'],
    correctAnswer: 'Shamisen',
    iso2: 'JP',
    difficulty: 3,
    explanation: 'Shamisen is plucked with a bachi; koto is the zither.',
  },
  {
    gameType: 'MUSIC',
    prompt:
      'Portuguese urban song of longing, often with guitarra portuguesa. What genre?',
    options: ['Fado', 'Flamenco', 'Morna', 'Tango'],
    correctAnswer: 'Fado',
    iso2: 'PT',
    difficulty: 2,
    explanation: 'Fado is Lisbon/Coimbra song tightly bound to saudade.',
  },
  {
    gameType: 'MUSIC',
    prompt:
      'Indian classical framework: scale, ascent/descent, time of day, and allowed ornaments. What term?',
    options: ['Raga', 'Tala only', 'Maqam', 'Mode'],
    correctAnswer: 'Raga',
    iso2: 'IN',
    difficulty: 3,
    explanation: 'A raga is a generative grammar, not a fixed tune.',
  },
  {
    gameType: 'MUSIC',
    prompt:
      'Rioplatense form born in working-class Buenos Aires/Montevideo, later ballroom-export. What dance-music?',
    options: ['Tango', 'Samba', 'Cumbia', 'Flamenco'],
    correctAnswer: 'Tango',
    iso2: 'AR',
    difficulty: 2,
    explanation: 'Tango is Rioplatense; milonga and vals are related social dances.',
  },
  {
    gameType: 'MUSIC',
    prompt:
      'Korean court and folk vocal tradition using a wide, controlled vibrato and dramatic narrative. What name is most precise here?',
    options: ['Pansori', 'K-pop', 'Gagaku', 'Noh chant'],
    correctAnswer: 'Pansori',
    iso2: 'KR',
    difficulty: 4,
    explanation: 'Pansori is epic solo song with a drummer; it is not pop export culture.',
  },
  {
    gameType: 'MUSIC',
    prompt:
      'Ghanaian/Nigerian highlife and Afrobeat both grew from brass-band + local rhythm contact. Which city is most associated with Fela’s Afrika 70 era?',
    options: ['Lagos', 'Accra only', 'Johannesburg', 'Dakar'],
    correctAnswer: 'Lagos',
    iso2: 'NG',
    difficulty: 4,
    explanation: 'Fela’s Afrobeat crystallized in Lagos clubs and the Kalakuta years.',
  },

  // World Map — correctAnswer is "lat,lng"
  {
    gameType: 'WORLD_MAP',
    prompt: 'Pin the ruins of Carthage on the Tunisian coast.',
    options: [],
    correctAnswer: '36.8528,10.3233',
    iso2: 'TN',
    difficulty: 3,
    explanation: 'Carthage sits on the Gulf of Tunis, just northeast of modern Tunis.',
  },
  {
    gameType: 'WORLD_MAP',
    prompt: 'Pin Machu Picchu in the Peruvian Andes.',
    options: [],
    correctAnswer: '-13.1631,-72.5450',
    iso2: 'PE',
    difficulty: 3,
    explanation: 'Machu Picchu is above the Urubamba valley, northwest of Cusco.',
  },
  {
    gameType: 'WORLD_MAP',
    prompt: 'Pin Petra, the Nabataean city cut into sandstone.',
    options: [],
    correctAnswer: '30.3285,35.4444',
    iso2: 'SA',
    difficulty: 4,
    explanation:
      'Petra is in southern Jordan. Saudi Arabia is the nearest seeded neighbor for the stamp.',
  },
  {
    gameType: 'WORLD_MAP',
    prompt: 'Pin Angkor Wat in Cambodia’s northern plains.',
    options: [],
    correctAnswer: '13.4125,103.8670',
    iso2: 'TH',
    difficulty: 3,
    explanation:
      'Angkor is near Siem Reap. Thailand is the nearest seeded neighbor for the stamp.',
  },
  {
    gameType: 'WORLD_MAP',
    prompt: 'Pin the Cape of Good Hope at Africa’s southwest corner.',
    options: [],
    correctAnswer: '-34.3587,18.4716',
    iso2: 'ZA',
    difficulty: 3,
    explanation: 'The Cape is south of Cape Town, not the continent’s southernmost tip (Cape Agulhas).',
  },
  {
    gameType: 'WORLD_MAP',
    prompt: 'Pin the Strait of Gibraltar.',
    options: [],
    correctAnswer: '35.9833,-5.4833',
    iso2: 'MA',
    difficulty: 3,
    explanation: 'The strait is the Atlantic–Mediterranean choke point between Spain and Morocco.',
  },
  {
    gameType: 'WORLD_MAP',
    prompt: 'Pin Lake Titicaca on the Peru–Bolivia altiplano.',
    options: [],
    correctAnswer: '-15.9254,-69.3354',
    iso2: 'PE',
    difficulty: 4,
    explanation: 'Titicaca is a high-altitude lake shared by Peru and Bolivia.',
  },
  {
    gameType: 'WORLD_MAP',
    prompt: 'Pin Uluru in Australia’s Red Centre.',
    options: [],
    correctAnswer: '-25.3444,131.0369',
    iso2: 'AU',
    difficulty: 3,
    explanation: 'Uluru is in the Northern Territory, far from the coastal state capitals.',
  },
  {
    gameType: 'WORLD_MAP',
    prompt: 'Pin Istanbul on the Bosporus.',
    options: [],
    correctAnswer: '41.0082,28.9784',
    iso2: 'TR',
    difficulty: 2,
    explanation: 'Istanbul straddles the Bosporus between the Sea of Marmara and the Black Sea.',
  },
  {
    gameType: 'WORLD_MAP',
    prompt: 'Pin Timbuktu on the southern edge of the Sahara.',
    options: [],
    correctAnswer: '16.7666,-3.0026',
    iso2: 'NG',
    difficulty: 4,
    explanation:
      'Timbuktu is in Mali, on the Niger Bend. Nigeria is the nearest seeded West African stamp.',
  },
  {
    gameType: 'WORLD_MAP',
    prompt: 'Pin Rapa Nui / Easter Island in the southeastern Pacific.',
    options: [],
    correctAnswer: '-27.1127,-109.3497',
    iso2: 'CL',
    difficulty: 4,
    explanation: 'Rapa Nui is a Chilean special territory, thousands of kilometres west of the mainland.',
  },
  {
    gameType: 'WORLD_MAP',
    prompt: 'Pin Kyoto, the former imperial capital of Japan.',
    options: [],
    correctAnswer: '35.0116,135.7681',
    iso2: 'JP',
    difficulty: 2,
    explanation: 'Kyoto is in the Kansai region, inland from Osaka Bay.',
  },

  // Mime / Scene Read
  {
    gameType: 'MIME',
    prompt:
      'A visitor in Tokyo receives a business card with two hands, reads it for several seconds, and places it on the table — not in a back pocket. What rule are they honoring?',
    options: [
      'Meishi is an extension of the person',
      'They are stalling to remember the name',
      'Cards are legally binding contracts',
      'Pockets are considered unclean in all of Japan',
    ],
    correctAnswer: 'Meishi is an extension of the person',
    iso2: 'JP',
    difficulty: 3,
    explanation: 'Treating a meishi casually can read as treating the person casually.',
  },
  {
    gameType: 'MIME',
    prompt:
      'In Addis Ababa a host roasts green coffee, walks the smoke toward guests, then serves three rounds. What is being staged?',
    options: [
      'Buna: coffee as a full social ceremony',
      'A caffeine taste test for export grades',
      'A religious fast-breaking only',
      'A replacement for a meal',
    ],
    correctAnswer: 'Buna: coffee as a full social ceremony',
    iso2: 'ET',
    difficulty: 3,
    explanation: 'The Ethiopian coffee ceremony is hospitality and time, not a quick espresso.',
  },
  {
    gameType: 'MIME',
    prompt:
      'At a Seoul dinner the youngest pours for elders with two hands and turns their own face slightly aside when drinking. What is the code?',
    options: [
      'Hierarchical respect in shared drinking',
      'They dislike the soju',
      'Alcohol is forbidden so they hide it',
      'It is only a TV drama trope with no basis',
    ],
    correctAnswer: 'Hierarchical respect in shared drinking',
    iso2: 'KR',
    difficulty: 3,
    explanation: 'Pouring and averted drinking mark rank and care, not shame about alcohol itself.',
  },
  {
    gameType: 'MIME',
    prompt:
      'A guest in a Tunis home leaves a little food on the plate after several offers to take more. What reading is most accurate?',
    options: [
      'Satiety after accepting hospitality',
      'An insult meaning the food was bad',
      'A signal they want the bill',
      'They are observing a medical fast',
    ],
    correctAnswer: 'Satiety after accepting hospitality',
    iso2: 'TN',
    difficulty: 3,
    explanation:
      'Repeated offers are hospitality; finishing every grain can trigger another refill. Context matters.',
  },
  {
    gameType: 'MIME',
    prompt:
      'In a German meeting everyone arrives three minutes early and starts at the agenda time without small talk. What norm is in force?',
    options: [
      'Punctuality as respect for shared time',
      'Coldness as a national personality',
      'The meeting is secretly cancelled',
      'Hierarchy forbids greetings',
    ],
    correctAnswer: 'Punctuality as respect for shared time',
    iso2: 'DE',
    difficulty: 2,
    explanation: 'Starting on time is a coordination ethic, not a claim about warmth.',
  },
  {
    gameType: 'MIME',
    prompt:
      'A Māori host leads visitors onto a marae; there is a challenge, then speech, then hongi. What is the sequence doing?',
    options: [
      'Turning strangers into recognized guests',
      'A sports haka for tourists',
      'A private family argument',
      'A military conscription rite',
    ],
    correctAnswer: 'Turning strangers into recognized guests',
    iso2: 'NZ',
    difficulty: 4,
    explanation: 'Pōwhiri moves people from tapu/outside to a relationship inside the marae.',
  },
  {
    gameType: 'MIME',
    prompt:
      'In Mexico City a guest arrives 30–45 minutes after the stated party time and is welcomed without apology theater. What is a fair reading?',
    options: [
      'Social time can be elastic for parties',
      'The guest is being rude in every context',
      'Mexican offices also ignore clocks',
      'Punctuality does not exist in the country',
    ],
    correctAnswer: 'Social time can be elastic for parties',
    iso2: 'MX',
    difficulty: 3,
    explanation: 'Party time and bureaucratic time are different codes; do not flatten either.',
  },
  {
    gameType: 'MIME',
    prompt:
      'A Thai visitor removes shoes at the threshold and steps over, not on, the door sill. What is being protected?',
    options: [
      'The house spirit / threshold as a boundary',
      'Only the wooden floor finish',
      'A legal requirement in the civil code',
      'A British colonial leftover',
    ],
    correctAnswer: 'The house spirit / threshold as a boundary',
    iso2: 'TH',
    difficulty: 3,
    explanation: 'Shoes-off and threshold care mark the home as a different moral space.',
  },
  {
    gameType: 'MIME',
    prompt:
      'In a Paris bakery the customer says bonjour before the order, then merci and au revoir. What failed if they skip the greeting?',
    options: [
      'The civility sequence that opens the transaction',
      'They will be legally refused service',
      'French has no word for please',
      'The pastry is reserved for regulars only',
    ],
    correctAnswer: 'The civility sequence that opens the transaction',
    iso2: 'FR',
    difficulty: 2,
    explanation: 'The greeting recognizes the other person before the request.',
  },
  {
    gameType: 'MIME',
    prompt:
      'An Indian host insists “eat, eat” after the guest says they are full. The guest takes a small extra portion. What is happening?',
    options: [
      'A hospitality loop of offer and token acceptance',
      'The host is forcing the guest',
      'The guest admitted the food was insufficient',
      'A caste rule about leftovers',
    ],
    correctAnswer: 'A hospitality loop of offer and token acceptance',
    iso2: 'IN',
    difficulty: 3,
    explanation: 'Refusal can be polite; a small accept closes the loop without a second meal.',
  },

  // Culture Code
  {
    gameType: 'CULTURE_CODE',
    prompt:
      'In much of East Asia, giving a clock as a gift can be risky. Why?',
    options: [
      'Clock/funeral homophony and end-of-time symbolism',
      'Clocks are always cheap',
      'Timepieces are illegal to import',
      'Only watches, never wall clocks, are fine',
    ],
    correctAnswer: 'Clock/funeral homophony and end-of-time symbolism',
    iso2: 'CN',
    difficulty: 4,
    explanation:
      'In Mandarin, gifting a clock (送钟) sounds like attending a funeral; context and generation vary.',
  },
  {
    gameType: 'CULTURE_CODE',
    prompt:
      'In Japan, leaving a tip on the table after a restaurant meal is often read as…',
    options: [
      'Confusion or a suggestion the service was extra-contractual',
      'The only way to be polite',
      'Required by labor law',
      'An insult meaning the food was free',
    ],
    correctAnswer: 'Confusion or a suggestion the service was extra-contractual',
    iso2: 'JP',
    difficulty: 3,
    explanation: 'Service is priced in; tipping can create an awkward debt the staff cannot accept.',
  },
  {
    gameType: 'CULTURE_CODE',
    prompt:
      'In many Muslim-majority and South Asian contexts, offering or eating with the left hand can offend. The practical reason historically is…',
    options: [
      'Left hand associated with washing after toilet use',
      'Left-handedness is illegal',
      'The right hand is weaker',
      'It is only a European myth',
    ],
    correctAnswer: 'Left hand associated with washing after toilet use',
    iso2: 'SA',
    difficulty: 3,
    explanation: 'The code is hygiene and respect; hosts may still accommodate left-handed guests.',
  },
  {
    gameType: 'CULTURE_CODE',
    prompt:
      'During Ramadan in Tunisia, a visitor eats in public on a main street at noon. What is the most accurate risk?',
    options: [
      'It can read as disregard for a communal fast',
      'It is a criminal act in every country',
      'Tunisians do not observe Ramadan',
      'Guests are required to fast by international law',
    ],
    correctAnswer: 'It can read as disregard for a communal fast',
    iso2: 'TN',
    difficulty: 3,
    explanation: 'Discretion is courtesy; rules and enforcement vary by country and space.',
  },
  {
    gameType: 'CULTURE_CODE',
    prompt:
      'In the United States, a server’s wage structure often assumes a tip. Skipping it entirely usually means…',
    options: [
      'The worker may earn below a living hourly rate',
      'The restaurant is scamming you',
      'Tipping is illegal tax evasion',
      'The meal was complimentary',
    ],
    correctAnswer: 'The worker may earn below a living hourly rate',
    iso2: 'US',
    difficulty: 2,
    explanation: 'US tipping is a labor-market institution, not just “extra kindness.”',
  },
  {
    gameType: 'CULTURE_CODE',
    prompt:
      'In Sweden, interrupting a pause in conversation can be a mistake because silence often means…',
    options: [
      'The other person is still thinking',
      'They want you to leave',
      'The deal is dead',
      'Swedish has no overlapping talk at all',
    ],
    correctAnswer: 'The other person is still thinking',
    iso2: 'SE',
    difficulty: 3,
    explanation: 'Nordic turn-taking often tolerates longer gaps than US/Italian styles.',
  },
  {
    gameType: 'CULTURE_CODE',
    prompt:
      'Showing the sole of your shoe toward someone in parts of the Arab world is widely read as…',
    options: [
      'Disrespect — the sole is the dirty side',
      'A friendly joke everywhere',
      'A marriage proposal',
      'A request for tea',
    ],
    correctAnswer: 'Disrespect — the sole is the dirty side',
    iso2: 'EG',
    difficulty: 2,
    explanation: 'Crossing a leg so a sole faces a person can land badly in formal settings.',
  },
  {
    gameType: 'CULTURE_CODE',
    prompt:
      'In Brazil, the OK hand sign (thumb-index circle) can be offensive. A safer positive gesture is often…',
    options: [
      'A thumbs-up',
      'The same OK sign, bigger',
      'Crossing fingers behind your back',
      'Pointing at the person',
    ],
    correctAnswer: 'A thumbs-up',
    iso2: 'BR',
    difficulty: 3,
    explanation: 'The OK circle can read as an insult in Brazil; thumbs-up is widely positive.',
  },
  {
    gameType: 'CULTURE_CODE',
    prompt:
      'A British email that says “That’s not quite what we had in mind” usually means…',
    options: [
      'A polite no — change the proposal',
      'Enthusiastic approval',
      'They want a larger font',
      'The meeting is moved to a pub',
    ],
    correctAnswer: 'A polite no — change the proposal',
    iso2: 'GB',
    difficulty: 3,
    explanation: 'UK understatement often codes rejection as mild disappointment.',
  },
  {
    gameType: 'CULTURE_CODE',
    prompt:
      'In India, a lateral head wobble during a conversation most often signals…',
    options: [
      'Acknowledgement / “I follow you,” not always yes-or-no',
      'A definite no',
      'Dizziness',
      'A demand to repeat everything in English',
    ],
    correctAnswer: 'Acknowledgement / “I follow you,” not always yes-or-no',
    iso2: 'IN',
    difficulty: 3,
    explanation: 'The wobble is a backchannel; treat it as engagement, then confirm decisions in words.',
  },
  {
    gameType: 'CULTURE_CODE',
    prompt:
      'Refusing a second cup of tea in a Central Asian or Maghrebi home by covering the glass can mean…',
    options: [
      'Thanks, I am done — a readable stop sign',
      'You hate the host',
      'You want food instead',
      'You are converting the visit into a sale',
    ],
    correctAnswer: 'Thanks, I am done — a readable stop sign',
    iso2: 'MA',
    difficulty: 3,
    explanation: 'A physical close (hand over glass) stops the refill loop more clearly than words alone.',
  },
  {
    gameType: 'CULTURE_CODE',
    prompt:
      'In Nigeria, asking “How is work?” before any task talk is often…',
    options: [
      'Relationship first, transaction second',
      'A waste of time in all contexts',
      'A legal prelude to a contract',
      'Only done in Lagos traffic',
    ],
    correctAnswer: 'Relationship first, transaction second',
    iso2: 'NG',
    difficulty: 3,
    explanation: 'Skipping greeting-and-welfare can make the request feel extractive.',
  },

  // History Clash
  {
    gameType: 'HISTORY_CLASH',
    prompt:
      '1955 conference in Indonesia where newly independent Asian and African states refused to be extras in the Cold War. Where?',
    options: ['Bandung', 'Yalta', 'Bretton Woods', 'Vienna 1815'],
    correctAnswer: 'Bandung',
    iso2: 'ID',
    difficulty: 4,
    explanation: 'The Bandung Conference helped seed the Non-Aligned Movement.',
  },
  {
    gameType: 'HISTORY_CLASH',
    prompt:
      'Japan’s crash modernization after 1868: abolish the shogunate, industrialize, rewrite the state. What name?',
    options: ['Meiji Restoration', 'Taika Reform', 'Occupation of 1945', 'Sengoku unification'],
    correctAnswer: 'Meiji Restoration',
    iso2: 'JP',
    difficulty: 3,
    explanation: 'Meiji rebuilt the imperial state as a modernizing project under Western pressure.',
  },
  {
    gameType: 'HISTORY_CLASH',
    prompt:
      'The only successful large-scale slave revolt that created an independent state in the Americas. Which revolution?',
    options: ['Haitian Revolution', 'American Revolution', 'Mexican Independence', 'Cuban Revolution'],
    correctAnswer: 'Haitian Revolution',
    iso2: 'BR',
    difficulty: 4,
    explanation:
      'Haiti (Saint-Domingue) defeated France and slavery. Brazil is the nearest seeded Atlantic-American stamp.',
  },
  {
    gameType: 'HISTORY_CLASH',
    prompt:
      '1494 Iberian treaty that drew a meridian to split extra-European claims. What treaty?',
    options: ['Tordesillas', 'Westphalia', 'Utrecht', 'Paris 1763'],
    correctAnswer: 'Tordesillas',
    iso2: 'PT',
    difficulty: 4,
    explanation: 'Tordesillas is why Brazil’s colonial language is Portuguese.',
  },
  {
    gameType: 'HISTORY_CLASH',
    prompt:
      '1453: which city’s fall to the Ottomans ended the Byzantine Empire and rewired Mediterranean trade?',
    options: ['Constantinople', 'Vienna', 'Baghdad', 'Granada'],
    correctAnswer: 'Constantinople',
    iso2: 'TR',
    difficulty: 3,
    explanation: 'Mehmed II took Constantinople; it became Istanbul, Ottoman capital.',
  },
  {
    gameType: 'HISTORY_CLASH',
    prompt:
      '1884–85 meeting where European powers set ground rules for colonizing Africa. What conference?',
    options: ['Berlin Conference', 'Congress of Vienna', 'Bandung', 'Yalta'],
    correctAnswer: 'Berlin Conference',
    iso2: 'DE',
    difficulty: 4,
    explanation:
      'Berlin formalized the Scramble’s diplomatic rules; it did not “give” Africa as empty land.',
  },
  {
    gameType: 'HISTORY_CLASH',
    prompt:
      '1957: first sub-Saharan African colony to win independence under a modern nationalist party, becoming a symbol for the continent. Which country?',
    options: ['Ghana', 'Kenya', 'Nigeria', 'South Africa'],
    correctAnswer: 'Ghana',
    iso2: 'GH',
    difficulty: 3,
    explanation: 'Gold Coast became Ghana under Kwame Nkrumah in 1957.',
  },
  {
    gameType: 'HISTORY_CLASH',
    prompt:
      '1840 agreement between the British Crown and many Māori rangatira, still the constitutional wound and foundation of New Zealand. What text?',
    options: ['Treaty of Waitangi', 'Magna Carta', 'ANZUS', 'Waitangi is a sports cup only'],
    correctAnswer: 'Treaty of Waitangi',
    iso2: 'NZ',
    difficulty: 4,
    explanation: 'Te Tiriti / the Treaty has two language versions and an ongoing legal-political life.',
  },
  {
    gameType: 'HISTORY_CLASH',
    prompt:
      '1930 march to the sea that broke the British salt monopoly as mass civil disobedience. Who led it?',
    options: ['Gandhi', 'Nehru only', 'Jinnah', 'Bose only'],
    correctAnswer: 'Gandhi',
    iso2: 'IN',
    difficulty: 3,
    explanation: 'The Salt March made colonial law visibly illegitimate to a mass public.',
  },
  {
    gameType: 'HISTORY_CLASH',
    prompt:
      '1962 crisis: Soviet missiles in Cuba, US blockade, brink of nuclear war. What is the standard name?',
    options: ['Cuban Missile Crisis', 'Bay of Pigs', 'Iran Hostage Crisis', 'Suez Crisis'],
    correctAnswer: 'Cuban Missile Crisis',
    iso2: 'US',
    difficulty: 3,
    explanation: 'The Thirteen Days forced a back-channel bargain: missiles out, Turkey/Jupiter in the shadows.',
  },
  {
    gameType: 'HISTORY_CLASH',
    prompt:
      '1648 treaties often cited as the template of sovereign states and non-interference — oversold, but the name stuck. What peace?',
    options: ['Westphalia', 'Versailles', 'Utrecht', 'Vienna'],
    correctAnswer: 'Westphalia',
    iso2: 'DE',
    difficulty: 4,
    explanation: 'Westphalia ended the Thirty Years’ War inside the Holy Roman Empire.',
  },
  {
    gameType: 'HISTORY_CLASH',
    prompt:
      '1810s–1820s: Andean and Southern Cone wars that broke Spanish rule. Which figure crossed the Andes toward Peru?',
    options: ['San Martín', 'Bolívar only', 'Iturbide', 'Pedro I of Brazil'],
    correctAnswer: 'San Martín',
    iso2: 'AR',
    difficulty: 4,
    explanation: 'José de San Martín’s Andes crossing linked Chilean and Peruvian independence campaigns.',
  },
];
