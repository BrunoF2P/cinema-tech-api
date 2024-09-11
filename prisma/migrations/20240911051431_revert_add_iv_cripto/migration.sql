/*
  Warnings:

  - You are about to alter the column `data_compra` on the `ingressos` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `data_pagamento` on the `pagamentos` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `data_reserva` on the `reservas` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `data_sessao` on the `sessoes` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `iv` on the `usuarios` table. All the data in the column will be lost.
  - You are about to alter the column `data_cadastro` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `ingressos` MODIFY `data_compra` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `pagamentos` MODIFY `data_pagamento` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `reservas` MODIFY `data_reserva` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `sessoes` MODIFY `data_sessao` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `iv`,
    MODIFY `data_cadastro` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
