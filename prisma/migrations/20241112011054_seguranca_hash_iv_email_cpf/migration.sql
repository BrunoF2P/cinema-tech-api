/*
  Warnings:

  - A unique constraint covering the columns `[cpf_hash]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[iv_cpf]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email_hash]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[iv_email]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf_hash` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email_hash` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iv_cpf` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iv_email` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "cpf_hash" VARCHAR(255) NOT NULL,
ADD COLUMN     "email_hash" VARCHAR(255) NOT NULL,
ADD COLUMN     "iv_cpf" VARCHAR(255) NOT NULL,
ADD COLUMN     "iv_email" VARCHAR(255) NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_hash_key" ON "usuarios"("cpf_hash");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_iv_cpf_key" ON "usuarios"("iv_cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_hash_key" ON "usuarios"("email_hash");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_iv_email_key" ON "usuarios"("iv_email");
