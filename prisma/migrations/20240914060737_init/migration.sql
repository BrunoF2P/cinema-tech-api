-- CreateTable
CREATE TABLE `usuarios` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `cpf` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `data_nascimento` DATE NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `data_cadastro` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_cidade` INTEGER NOT NULL,
    `id_estado` INTEGER NOT NULL,
    `id_tipo_usuario` INTEGER NOT NULL,

    UNIQUE INDEX `usuarios_cpf_key`(`cpf`),
    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipo_usuarios` (
    `id_tipo_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `tipo_usuarios_descricao_key`(`descricao`),
    PRIMARY KEY (`id_tipo_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cidades` (
    `id_cidade` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_cidade` VARCHAR(100) NOT NULL,
    `id_estado` INTEGER NOT NULL,

    PRIMARY KEY (`id_cidade`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estados` (
    `id_estado` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_estado` VARCHAR(100) NOT NULL,
    `sigla_estado` VARCHAR(2) NOT NULL,

    UNIQUE INDEX `estados_nome_estado_key`(`nome_estado`),
    UNIQUE INDEX `estados_sigla_estado_key`(`sigla_estado`),
    PRIMARY KEY (`id_estado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `filmes` (
    `id_filme` INTEGER NOT NULL AUTO_INCREMENT,
    `id_api` INTEGER NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `sinopse` TEXT NOT NULL,
    `data_lancamento` DATE NOT NULL,
    `duracao` INTEGER NOT NULL,
    `classificacao_etaria` INTEGER NOT NULL,
    `poster_path` VARCHAR(255) NOT NULL,
    `backdrop_path` VARCHAR(255) NOT NULL,
    `nota_imdb` DECIMAL(3, 2) NOT NULL,

    UNIQUE INDEX `filmes_slug_key`(`slug`),
    PRIMARY KEY (`id_filme`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `generos` (
    `id_genero` INTEGER NOT NULL AUTO_INCREMENT,
    `id_api` INTEGER NULL,
    `nome_genero` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `generos_nome_genero_key`(`nome_genero`),
    PRIMARY KEY (`id_genero`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `filme_genero` (
    `id_filme` INTEGER NOT NULL,
    `id_genero` INTEGER NOT NULL,

    PRIMARY KEY (`id_filme`, `id_genero`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `salas` (
    `id_sala` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_sala` VARCHAR(100) NOT NULL,
    `capacidade` INTEGER NOT NULL,
    `id_tipo_sala` INTEGER NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id_sala`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipos_salas` (
    `id_tipo_sala` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `tipos_salas_descricao_key`(`descricao`),
    PRIMARY KEY (`id_tipo_sala`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cadeiras` (
    `id_cadeira` INTEGER NOT NULL AUTO_INCREMENT,
    `id_sala` INTEGER NOT NULL,
    `linha` CHAR(1) NOT NULL,
    `numero` INTEGER NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id_cadeira`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessoes` (
    `id_sessao` INTEGER NOT NULL AUTO_INCREMENT,
    `id_filme` INTEGER NOT NULL,
    `id_sala` INTEGER NOT NULL,
    `data_sessao` DATETIME NOT NULL,

    PRIMARY KEY (`id_sessao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservas` (
    `id_reserva` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_sessao` INTEGER NOT NULL,
    `data_reserva` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('pendente', 'confirmado', 'cancelado') NOT NULL DEFAULT 'pendente',

    PRIMARY KEY (`id_reserva`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ingressos` (
    `id_ingresso` INTEGER NOT NULL AUTO_INCREMENT,
    `id_sessao` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,
    `id_tipo` INTEGER NOT NULL,
    `id_cadeira` INTEGER NOT NULL,
    `data_compra` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_ingresso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipos_ingressos` (
    `id_tipo` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `tipos_ingressos_descricao_key`(`descricao`),
    PRIMARY KEY (`id_tipo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `precos_ingressos` (
    `id_preco` INTEGER NOT NULL AUTO_INCREMENT,
    `id_sessao` INTEGER NOT NULL,
    `id_tipo` INTEGER NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id_preco`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pagamentos` (
    `id_pagamento` INTEGER NOT NULL AUTO_INCREMENT,
    `id_reserva` INTEGER NOT NULL,
    `valor_total` DECIMAL(10, 2) NOT NULL,
    `metodo_pagamento` ENUM('credito', 'debito', 'pix', 'dinheiro') NOT NULL,
    `status` ENUM('pendente', 'confirmado', 'cancelado') NOT NULL DEFAULT 'pendente',
    `data_pagamento` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_transacao_api` VARCHAR(255) NULL,

    PRIMARY KEY (`id_pagamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_FilmeGeneros` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FilmeGeneros_AB_unique`(`A`, `B`),
    INDEX `_FilmeGeneros_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_id_cidade_fkey` FOREIGN KEY (`id_cidade`) REFERENCES `cidades`(`id_cidade`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_id_estado_fkey` FOREIGN KEY (`id_estado`) REFERENCES `estados`(`id_estado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_id_tipo_usuario_fkey` FOREIGN KEY (`id_tipo_usuario`) REFERENCES `tipo_usuarios`(`id_tipo_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cidades` ADD CONSTRAINT `cidades_id_estado_fkey` FOREIGN KEY (`id_estado`) REFERENCES `estados`(`id_estado`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `filme_genero` ADD CONSTRAINT `filme_genero_id_filme_fkey` FOREIGN KEY (`id_filme`) REFERENCES `filmes`(`id_filme`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `filme_genero` ADD CONSTRAINT `filme_genero_id_genero_fkey` FOREIGN KEY (`id_genero`) REFERENCES `generos`(`id_genero`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salas` ADD CONSTRAINT `salas_id_tipo_sala_fkey` FOREIGN KEY (`id_tipo_sala`) REFERENCES `tipos_salas`(`id_tipo_sala`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cadeiras` ADD CONSTRAINT `cadeiras_id_sala_fkey` FOREIGN KEY (`id_sala`) REFERENCES `salas`(`id_sala`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessoes` ADD CONSTRAINT `sessoes_id_filme_fkey` FOREIGN KEY (`id_filme`) REFERENCES `filmes`(`id_filme`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessoes` ADD CONSTRAINT `sessoes_id_sala_fkey` FOREIGN KEY (`id_sala`) REFERENCES `salas`(`id_sala`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservas` ADD CONSTRAINT `reservas_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservas` ADD CONSTRAINT `reservas_id_sessao_fkey` FOREIGN KEY (`id_sessao`) REFERENCES `sessoes`(`id_sessao`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ingressos` ADD CONSTRAINT `ingressos_id_sessao_fkey` FOREIGN KEY (`id_sessao`) REFERENCES `sessoes`(`id_sessao`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ingressos` ADD CONSTRAINT `ingressos_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ingressos` ADD CONSTRAINT `ingressos_id_tipo_fkey` FOREIGN KEY (`id_tipo`) REFERENCES `tipos_ingressos`(`id_tipo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ingressos` ADD CONSTRAINT `ingressos_id_cadeira_fkey` FOREIGN KEY (`id_cadeira`) REFERENCES `cadeiras`(`id_cadeira`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `precos_ingressos` ADD CONSTRAINT `precos_ingressos_id_sessao_fkey` FOREIGN KEY (`id_sessao`) REFERENCES `sessoes`(`id_sessao`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `precos_ingressos` ADD CONSTRAINT `precos_ingressos_id_tipo_fkey` FOREIGN KEY (`id_tipo`) REFERENCES `tipos_ingressos`(`id_tipo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagamentos` ADD CONSTRAINT `pagamentos_id_reserva_fkey` FOREIGN KEY (`id_reserva`) REFERENCES `reservas`(`id_reserva`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FilmeGeneros` ADD CONSTRAINT `_FilmeGeneros_A_fkey` FOREIGN KEY (`A`) REFERENCES `filmes`(`id_filme`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FilmeGeneros` ADD CONSTRAINT `_FilmeGeneros_B_fkey` FOREIGN KEY (`B`) REFERENCES `generos`(`id_genero`) ON DELETE CASCADE ON UPDATE CASCADE;
