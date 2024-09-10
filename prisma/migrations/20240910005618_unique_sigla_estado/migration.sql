/*
  Warnings:

  - You are about to alter the column `data_compra` on the `ingressos` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `data_pagamento` on the `pagamentos` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `data_reserva` on the `reservas` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `data_sessao` on the `sessoes` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `data_cadastro` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - A unique constraint covering the columns `[sigla_estado]` on the table `estados` will be added. If there are existing duplicate values, this will fail.

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
ALTER TABLE `usuarios` MODIFY `data_cadastro` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `estados_sigla_estado_key` ON `estados`(`sigla_estado`);
