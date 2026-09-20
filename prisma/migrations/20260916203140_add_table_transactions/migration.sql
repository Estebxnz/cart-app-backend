-- CreateEnum
CREATE TYPE "cartapp_api"."TransactionType" AS ENUM ('DEPOSIT', 'PURCHASE', 'SALE');

-- CreateTable
CREATE TABLE "cartapp_api"."transactions" (
    "id" SERIAL NOT NULL,
    "wallet_id" INTEGER NOT NULL,
    "order_id" INTEGER,
    "type" "cartapp_api"."TransactionType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transactions_wallet_id_idx" ON "cartapp_api"."transactions"("wallet_id");

-- CreateIndex
CREATE INDEX "transactions_order_id_idx" ON "cartapp_api"."transactions"("order_id");

-- AddForeignKey
ALTER TABLE "cartapp_api"."transactions" ADD CONSTRAINT "transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "cartapp_api"."wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cartapp_api"."transactions" ADD CONSTRAINT "transactions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "cartapp_api"."orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
