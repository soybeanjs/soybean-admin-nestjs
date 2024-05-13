-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ENABLED', 'DISABLED', 'BANNED');

-- CreateTable
CREATE TABLE "sys_users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "built_in" BOOLEAN NOT NULL DEFAULT false,
    "avatar" TEXT,
    "department_id" INTEGER,
    "email" TEXT,
    "phone_number" TEXT,
    "nike_name" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" TEXT,

    CONSTRAINT "sys_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "casbin_rule" (
    "id" SERIAL NOT NULL,
    "ptype" TEXT NOT NULL,
    "v0" TEXT,
    "v1" TEXT,
    "v2" TEXT,
    "v3" TEXT,
    "v4" TEXT,
    "v5" TEXT,

    CONSTRAINT "casbin_rule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sys_users_username_key" ON "sys_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "sys_users_email_key" ON "sys_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sys_users_phone_number_key" ON "sys_users"("phone_number");
