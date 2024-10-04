/*
  Warnings:

  - Added the required column `data_expiracao` to the `reservas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reservas" ADD COLUMN     "data_expiracao" TIMESTAMP(3) NOT NULL;
