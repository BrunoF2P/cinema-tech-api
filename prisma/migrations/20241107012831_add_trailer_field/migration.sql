/*
  Warnings:

  - You are about to drop the column `backdrop_path` on the `filmes` table. All the data in the column will be lost.
  - You are about to drop the column `data_expiracao` on the `reservas` table. All the data in the column will be lost.
  - Added the required column `trailer_url` to the `filmes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "filmes" DROP COLUMN "backdrop_path",
ADD COLUMN     "trailer_url" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "reservas" DROP COLUMN "data_expiracao";
