/*
  Warnings:

  - You are about to alter the column `data_compra` on the `ingressos` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `data_pagamento` on the `pagamentos` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `data_reserva` on the `reservas` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `data_sessao` on the `sessoes` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `data_cadastro` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - A unique constraint covering the columns `[nome_estado]` on the table `estados` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome_genero]` on the table `generos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[descricao]` on the table `tipo_usuarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[descricao]` on the table `tipos_ingressos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[descricao]` on the table `tipos_salas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

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
CREATE UNIQUE INDEX `estados_nome_estado_key` ON `estados`(`nome_estado`);

-- CreateIndex
CREATE UNIQUE INDEX `generos_nome_genero_key` ON `generos`(`nome_genero`);

-- CreateIndex
CREATE UNIQUE INDEX `tipo_usuarios_descricao_key` ON `tipo_usuarios`(`descricao`);

-- CreateIndex
CREATE UNIQUE INDEX `tipos_ingressos_descricao_key` ON `tipos_ingressos`(`descricao`);

-- CreateIndex
CREATE UNIQUE INDEX `tipos_salas_descricao_key` ON `tipos_salas`(`descricao`);

-- CreateIndex
CREATE UNIQUE INDEX `usuarios_cpf_key` ON `usuarios`(`cpf`);

-- CreateIndex
CREATE UNIQUE INDEX `usuarios_email_key` ON `usuarios`(`email`);
