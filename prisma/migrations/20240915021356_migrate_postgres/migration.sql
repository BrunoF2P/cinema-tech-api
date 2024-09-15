-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pendente', 'confirmado', 'cancelado');

-- CreateEnum
CREATE TYPE "MetodoPagamento" AS ENUM ('credito', 'debito', 'pix', 'dinheiro');

-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('pendente', 'confirmado', 'cancelado');

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "cpf" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "data_nascimento" DATE NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "data_cadastro" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_cidade" INTEGER NOT NULL,
    "id_estado" INTEGER NOT NULL,
    "id_tipo_usuario" INTEGER NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "tipo_usuarios" (
    "id_tipo_usuario" SERIAL NOT NULL,
    "descricao" VARCHAR(50) NOT NULL,

    CONSTRAINT "tipo_usuarios_pkey" PRIMARY KEY ("id_tipo_usuario")
);

-- CreateTable
CREATE TABLE "cidades" (
    "id_cidade" SERIAL NOT NULL,
    "nome_cidade" VARCHAR(100) NOT NULL,
    "id_estado" INTEGER NOT NULL,

    CONSTRAINT "cidades_pkey" PRIMARY KEY ("id_cidade")
);

-- CreateTable
CREATE TABLE "estados" (
    "id_estado" SERIAL NOT NULL,
    "nome_estado" VARCHAR(100) NOT NULL,
    "sigla_estado" VARCHAR(2) NOT NULL,

    CONSTRAINT "estados_pkey" PRIMARY KEY ("id_estado")
);

-- CreateTable
CREATE TABLE "filmes" (
    "id_filme" SERIAL NOT NULL,
    "id_api" INTEGER,
    "titulo" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "sinopse" TEXT NOT NULL,
    "data_lancamento" DATE NOT NULL,
    "duracao" INTEGER NOT NULL,
    "classificacao_etaria" INTEGER NOT NULL,
    "poster_path" VARCHAR(255) NOT NULL,
    "backdrop_path" VARCHAR(255) NOT NULL,
    "nota_imdb" DECIMAL(3,2) NOT NULL,

    CONSTRAINT "filmes_pkey" PRIMARY KEY ("id_filme")
);

-- CreateTable
CREATE TABLE "generos" (
    "id_genero" SERIAL NOT NULL,
    "id_api" INTEGER,
    "nome_genero" VARCHAR(100) NOT NULL,

    CONSTRAINT "generos_pkey" PRIMARY KEY ("id_genero")
);

-- CreateTable
CREATE TABLE "filme_genero" (
    "id_filme" INTEGER NOT NULL,
    "id_genero" INTEGER NOT NULL,

    CONSTRAINT "filme_genero_pkey" PRIMARY KEY ("id_filme","id_genero")
);

-- CreateTable
CREATE TABLE "salas" (
    "id_sala" SERIAL NOT NULL,
    "nome_sala" VARCHAR(100) NOT NULL,
    "capacidade" INTEGER NOT NULL,
    "id_tipo_sala" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "salas_pkey" PRIMARY KEY ("id_sala")
);

-- CreateTable
CREATE TABLE "tipos_salas" (
    "id_tipo_sala" SERIAL NOT NULL,
    "descricao" VARCHAR(50) NOT NULL,

    CONSTRAINT "tipos_salas_pkey" PRIMARY KEY ("id_tipo_sala")
);

-- CreateTable
CREATE TABLE "cadeiras" (
    "id_cadeira" SERIAL NOT NULL,
    "id_sala" INTEGER NOT NULL,
    "linha" CHAR(1) NOT NULL,
    "numero" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "cadeiras_pkey" PRIMARY KEY ("id_cadeira")
);

-- CreateTable
CREATE TABLE "sessoes" (
    "id_sessao" SERIAL NOT NULL,
    "id_filme" INTEGER NOT NULL,
    "id_sala" INTEGER NOT NULL,
    "data_sessao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessoes_pkey" PRIMARY KEY ("id_sessao")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id_reserva" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_sessao" INTEGER NOT NULL,
    "data_reserva" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL DEFAULT 'pendente',

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id_reserva")
);

-- CreateTable
CREATE TABLE "ingressos" (
    "id_ingresso" SERIAL NOT NULL,
    "id_sessao" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_tipo" INTEGER NOT NULL,
    "id_cadeira" INTEGER NOT NULL,
    "data_compra" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingressos_pkey" PRIMARY KEY ("id_ingresso")
);

-- CreateTable
CREATE TABLE "tipos_ingressos" (
    "id_tipo" SERIAL NOT NULL,
    "descricao" VARCHAR(50) NOT NULL,

    CONSTRAINT "tipos_ingressos_pkey" PRIMARY KEY ("id_tipo")
);

-- CreateTable
CREATE TABLE "precos_ingressos" (
    "id_preco" SERIAL NOT NULL,
    "id_sessao" INTEGER NOT NULL,
    "id_tipo" INTEGER NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "precos_ingressos_pkey" PRIMARY KEY ("id_preco")
);

-- CreateTable
CREATE TABLE "pagamentos" (
    "id_pagamento" SERIAL NOT NULL,
    "id_reserva" INTEGER NOT NULL,
    "valor_total" DECIMAL(10,2) NOT NULL,
    "metodo_pagamento" "MetodoPagamento" NOT NULL,
    "status" "StatusPagamento" NOT NULL DEFAULT 'pendente',
    "data_pagamento" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_transacao_api" VARCHAR(255),

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id_pagamento")
);

-- CreateTable
CREATE TABLE "_FilmeGeneros" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_usuarios_descricao_key" ON "tipo_usuarios"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "estados_nome_estado_key" ON "estados"("nome_estado");

-- CreateIndex
CREATE UNIQUE INDEX "estados_sigla_estado_key" ON "estados"("sigla_estado");

-- CreateIndex
CREATE UNIQUE INDEX "filmes_slug_key" ON "filmes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "generos_nome_genero_key" ON "generos"("nome_genero");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_salas_descricao_key" ON "tipos_salas"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_ingressos_descricao_key" ON "tipos_ingressos"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "_FilmeGeneros_AB_unique" ON "_FilmeGeneros"("A", "B");

-- CreateIndex
CREATE INDEX "_FilmeGeneros_B_index" ON "_FilmeGeneros"("B");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_cidade_fkey" FOREIGN KEY ("id_cidade") REFERENCES "cidades"("id_cidade") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "estados"("id_estado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_tipo_usuario_fkey" FOREIGN KEY ("id_tipo_usuario") REFERENCES "tipo_usuarios"("id_tipo_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cidades" ADD CONSTRAINT "cidades_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "estados"("id_estado") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filme_genero" ADD CONSTRAINT "filme_genero_id_filme_fkey" FOREIGN KEY ("id_filme") REFERENCES "filmes"("id_filme") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filme_genero" ADD CONSTRAINT "filme_genero_id_genero_fkey" FOREIGN KEY ("id_genero") REFERENCES "generos"("id_genero") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salas" ADD CONSTRAINT "salas_id_tipo_sala_fkey" FOREIGN KEY ("id_tipo_sala") REFERENCES "tipos_salas"("id_tipo_sala") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cadeiras" ADD CONSTRAINT "cadeiras_id_sala_fkey" FOREIGN KEY ("id_sala") REFERENCES "salas"("id_sala") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_id_filme_fkey" FOREIGN KEY ("id_filme") REFERENCES "filmes"("id_filme") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_id_sala_fkey" FOREIGN KEY ("id_sala") REFERENCES "salas"("id_sala") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_id_sessao_fkey" FOREIGN KEY ("id_sessao") REFERENCES "sessoes"("id_sessao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingressos" ADD CONSTRAINT "ingressos_id_sessao_fkey" FOREIGN KEY ("id_sessao") REFERENCES "sessoes"("id_sessao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingressos" ADD CONSTRAINT "ingressos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingressos" ADD CONSTRAINT "ingressos_id_tipo_fkey" FOREIGN KEY ("id_tipo") REFERENCES "tipos_ingressos"("id_tipo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingressos" ADD CONSTRAINT "ingressos_id_cadeira_fkey" FOREIGN KEY ("id_cadeira") REFERENCES "cadeiras"("id_cadeira") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precos_ingressos" ADD CONSTRAINT "precos_ingressos_id_sessao_fkey" FOREIGN KEY ("id_sessao") REFERENCES "sessoes"("id_sessao") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precos_ingressos" ADD CONSTRAINT "precos_ingressos_id_tipo_fkey" FOREIGN KEY ("id_tipo") REFERENCES "tipos_ingressos"("id_tipo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reservas"("id_reserva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilmeGeneros" ADD CONSTRAINT "_FilmeGeneros_A_fkey" FOREIGN KEY ("A") REFERENCES "filmes"("id_filme") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilmeGeneros" ADD CONSTRAINT "_FilmeGeneros_B_fkey" FOREIGN KEY ("B") REFERENCES "generos"("id_genero") ON DELETE CASCADE ON UPDATE CASCADE;
