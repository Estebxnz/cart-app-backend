/*
  Warnings:

  - Made the column `image_url` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image_public_id` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cartapp_api"."products" ALTER COLUMN "image_url" SET NOT NULL,
ALTER COLUMN "image_public_id" SET NOT NULL;
