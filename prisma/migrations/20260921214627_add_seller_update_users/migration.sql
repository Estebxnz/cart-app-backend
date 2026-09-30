/*
  Warnings:

  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - Added the required column `seller_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "cartapp_api"."ukr43af9ap4edm43mmtq01oddj6";

-- AlterTable
ALTER TABLE "cartapp_api"."products" ADD COLUMN     "seller_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "cartapp_api"."users" DROP COLUMN "username",
ADD COLUMN     "address" VARCHAR(255) NOT NULL,
ADD COLUMN     "city" VARCHAR(100) NOT NULL,
ADD COLUMN     "lastname" VARCHAR(255) NOT NULL,
ADD COLUMN     "name" VARCHAR(255) NOT NULL,
ADD COLUMN     "phone" VARCHAR(20) NOT NULL;

-- CreateTable
CREATE TABLE "cartapp_api"."sellers" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "storeName" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sellers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sellers_user_id_key" ON "cartapp_api"."sellers"("user_id");

-- AddForeignKey
ALTER TABLE "cartapp_api"."products" ADD CONSTRAINT "products_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "cartapp_api"."sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartapp_api"."sellers" ADD CONSTRAINT "sellers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "cartapp_api"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
