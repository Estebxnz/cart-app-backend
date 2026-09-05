/*
  Warnings:

  - Made the column `name` on table `roles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cartapp_api"."roles" ALTER COLUMN "name" SET NOT NULL;
