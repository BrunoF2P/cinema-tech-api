/*
  Warnings:

  - You are about to drop the column `id_cadeira` on the `reservas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "reservas" DROP CONSTRAINT "reservas_id_cadeira_fkey";

-- AlterTable
ALTER TABLE "reservas" DROP COLUMN "id_cadeira";

-- CreateTable
CREATE TABLE "reservas_cadeiras" (
    "id_reserva" INTEGER NOT NULL,
    "id_cadeira" INTEGER NOT NULL,
    "id_tipo_ingresso" INTEGER NOT NULL,

    CONSTRAINT "reservas_cadeiras_pkey" PRIMARY KEY ("id_reserva","id_cadeira")
);

-- AddForeignKey
ALTER TABLE "reservas_cadeiras" ADD CONSTRAINT "reservas_cadeiras_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reservas"("id_reserva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas_cadeiras" ADD CONSTRAINT "reservas_cadeiras_id_cadeira_fkey" FOREIGN KEY ("id_cadeira") REFERENCES "cadeiras"("id_cadeira") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas_cadeiras" ADD CONSTRAINT "reservas_cadeiras_id_tipo_ingresso_fkey" FOREIGN KEY ("id_tipo_ingresso") REFERENCES "tipos_ingressos"("id_tipo") ON DELETE RESTRICT ON UPDATE CASCADE;
