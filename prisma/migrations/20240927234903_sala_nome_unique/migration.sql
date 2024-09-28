/*
  Warnings:

  - A unique constraint covering the columns `[nome_sala]` on the table `salas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "salas_nome_sala_key" ON "salas"("nome_sala");
