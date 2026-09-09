/*
  Warnings:

  - Added the required column `updated_at` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cartapp_api"."products" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "cartapp_api"."users" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "cartapp_api"."wallet" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cartapp_api"."orders" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cartapp_api"."order_items" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallet_user_id_key" ON "cartapp_api"."wallet"("user_id");

-- CreateIndex
CREATE INDEX "orders_user_id_idx" ON "cartapp_api"."orders"("user_id");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "cartapp_api"."order_items"("order_id");

-- CreateIndex
CREATE INDEX "order_items_product_id_idx" ON "cartapp_api"."order_items"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_order_product" ON "cartapp_api"."order_items"("order_id", "product_id");

-- AddForeignKey
ALTER TABLE "cartapp_api"."wallet" ADD CONSTRAINT "fkg5uhi8vpsuy0lgloxk2h4w5o6" FOREIGN KEY ("user_id") REFERENCES "cartapp_api"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cartapp_api"."orders" ADD CONSTRAINT "fk1g0x3j6q7v5k1l8m9n2o3p4q5" FOREIGN KEY ("user_id") REFERENCES "cartapp_api"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cartapp_api"."order_items" ADD CONSTRAINT "fk1h2j3k4l5m6n7o8p9q0r1s2t3" FOREIGN KEY ("order_id") REFERENCES "cartapp_api"."orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cartapp_api"."order_items" ADD CONSTRAINT "fk4u5v6w7x8y9z0a1b2c3d4e5f6" FOREIGN KEY ("product_id") REFERENCES "cartapp_api"."products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
