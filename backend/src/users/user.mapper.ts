import type { Country, User } from '@prisma/client';
import type { CountrySummary, MeUser, PublicUser } from '@world-challenge/shared';

type UserWithCountry = User & { country: Country };

export function toCountrySummary(country: Country): CountrySummary {
  return {
    id: country.id,
    iso2: country.iso2,
    iso3: country.iso3,
    name: country.name,
    officialName: country.officialName,
    capital: country.capital,
    continent: country.continent,
    region: country.region,
    flagEmoji: country.flagEmoji,
    flagUrl: country.flagUrl,
  };
}

export function toPublicUser(user: UserWithCountry): PublicUser {
  return {
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    language: user.language,
    xp: user.xp,
    level: user.level,
    isOnline: user.isOnline,
    country: toCountrySummary(user.country),
  };
}

export function toMeUser(user: UserWithCountry): MeUser {
  return {
    ...toPublicUser(user),
    email: user.email,
    dateOfBirth: user.dateOfBirth.toISOString().slice(0, 10),
    isAdmin: user.isAdmin,
    createdAt: user.createdAt.toISOString(),
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    lastLoginCountryIso2: user.lastLoginCountryIso2,
    signupCountryIso2: user.signupCountryIso2,
  };
}
