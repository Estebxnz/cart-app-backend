/*
  Warnings:

  - Made the column `quantity` on table `cart_item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cart_id` on table `cart_item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `cart_item` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cartapp_api"."cart_item" ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "cart_id" SET NOT NULL,
ALTER COLUMN "product_id" SET NOT NULL;
