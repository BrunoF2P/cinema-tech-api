/*
  Warnings:

  - You are about to drop the `_FilmeGeneros` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `filme_genero` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FilmeGeneros" DROP CONSTRAINT "_FilmeGeneros_A_fkey";

-- DropForeignKey
ALTER TABLE "_FilmeGeneros" DROP CONSTRAINT "_FilmeGeneros_B_fkey";

-- DropForeignKey
ALTER TABLE "filme_genero" DROP CONSTRAINT "filme_genero_id_filme_fkey";

-- DropForeignKey
ALTER TABLE "filme_genero" DROP CONSTRAINT "filme_genero_id_genero_fkey";

-- DropTable
DROP TABLE "_FilmeGeneros";

-- DropTable
DROP TABLE "filme_genero";

-- CreateTable
CREATE TABLE "filmes_generos" (
    "id_filme" INTEGER NOT NULL,
    "id_genero" INTEGER NOT NULL,

    CONSTRAINT "filmes_generos_pkey" PRIMARY KEY ("id_filme","id_genero")
);

-- CreateIndex
CREATE INDEX "filmes_titulo_idx" ON "filmes"("titulo");

-- CreateIndex
CREATE INDEX "generos_nome_genero_idx" ON "generos"("nome_genero");

-- AddForeignKey
ALTER TABLE "filmes_generos" ADD CONSTRAINT "filmes_generos_id_filme_fkey" FOREIGN KEY ("id_filme") REFERENCES "filmes"("id_filme") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filmes_generos" ADD CONSTRAINT "filmes_generos_id_genero_fkey" FOREIGN KEY ("id_genero") REFERENCES "generos"("id_genero") ON DELETE CASCADE ON UPDATE CASCADE;
