/*
  Warnings:

  - A unique constraint covering the columns `[id_sala,linha,numero]` on the table `cadeiras` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_cadeira` to the `reservas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reservas" ADD COLUMN     "id_cadeira" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cadeiras_id_sala_linha_numero_key" ON "cadeiras"("id_sala", "linha", "numero");

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_id_cadeira_fkey" FOREIGN KEY ("id_cadeira") REFERENCES "cadeiras"("id_cadeira") ON DELETE RESTRICT ON UPDATE CASCADE;
