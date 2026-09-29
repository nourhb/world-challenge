-- AlterTable
ALTER TABLE "User" ADD COLUMN "signupIpHash" TEXT;
ALTER TABLE "User" ADD COLUMN "signupCountryIso2" TEXT;
ALTER TABLE "User" ADD COLUMN "lastLoginAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "lastLoginIpHash" TEXT;
ALTER TABLE "User" ADD COLUMN "lastLoginCountryIso2" TEXT;
