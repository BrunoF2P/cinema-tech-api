/*
  Warnings:

  - You are about to drop the `pagamentos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `total` to the `reservas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pagamentos" DROP CONSTRAINT "pagamentos_id_reserva_fkey";

-- AlterTable
ALTER TABLE "reservas" ADD COLUMN     "total" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "transacao_id" TEXT;

-- DropTable
DROP TABLE "pagamentos";

-- DropEnum
DROP TYPE "MetodoPagamento";

-- DropEnum
DROP TYPE "StatusPagamento";
