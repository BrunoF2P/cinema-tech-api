-- DropForeignKey
ALTER TABLE "reservas_cadeiras" DROP CONSTRAINT "reservas_cadeiras_id_reserva_fkey";

-- AddForeignKey
ALTER TABLE "reservas_cadeiras" ADD CONSTRAINT "reservas_cadeiras_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reservas"("id_reserva") ON DELETE CASCADE ON UPDATE CASCADE;
