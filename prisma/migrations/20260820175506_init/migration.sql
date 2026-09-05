-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "cartapp_api";

-- CreateTable
CREATE TABLE "cartapp_api"."cart" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cartapp_api"."cart_item" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER,
    "cart_id" INTEGER,
    "product_id" INTEGER,

    CONSTRAINT "cart_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cartapp_api"."products" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "stock" INTEGER NOT NULL,
    "image_url" VARCHAR(255),
    "image_public_id" VARCHAR(255),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cartapp_api"."roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cartapp_api"."users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cartapp_api"."users_roles" (
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "uk9emlp6m95v5er2bcqkjsw48he" ON "cartapp_api"."cart"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_cart_product" ON "cartapp_api"."cart_item"("cart_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "ukofx66keruapi6vyqpv6f2or37" ON "cartapp_api"."roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "uk6dotkott2kjsp8vw4d0m25fb7" ON "cartapp_api"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ukr43af9ap4edm43mmtq01oddj6" ON "cartapp_api"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ukq3r1u8cne2rw2hkr899xuh7vj" ON "cartapp_api"."users_roles"("user_id", "role_id");

-- AddForeignKey
ALTER TABLE "cartapp_api"."cart" ADD CONSTRAINT "fkg5uhi8vpsuy0lgloxk2h4w5o6" FOREIGN KEY ("user_id") REFERENCES "cartapp_api"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cartapp_api"."cart_item" ADD CONSTRAINT "fk1uobyhgl1wvgt1jpccia8xxs3" FOREIGN KEY ("cart_id") REFERENCES "cartapp_api"."cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cartapp_api"."cart_item" ADD CONSTRAINT "fkqkqmvkmbtiaqn2nfqf25ymfs2" FOREIGN KEY ("product_id") REFERENCES "cartapp_api"."products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cartapp_api"."users_roles" ADD CONSTRAINT "fk2o0jvgh89lemvvo17cbqvdxaa" FOREIGN KEY ("user_id") REFERENCES "cartapp_api"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cartapp_api"."users_roles" ADD CONSTRAINT "fkj6m8fwv7oqv74fcehir1a9ffy" FOREIGN KEY ("role_id") REFERENCES "cartapp_api"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
