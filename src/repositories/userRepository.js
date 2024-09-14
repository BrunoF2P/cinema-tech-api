import prisma from '../../prismaClient.js';

async function findUserByEmail  (email) {
    return prisma.usuario.findUnique({
        where: {
            email: email,
        },
    });

}

async function findUserByCpf(cpf) {
    return prisma.usuario.findUnique({
        where: {
            cpf: cpf,
        },
    });
}

async function findTypeUserByDescription (descricao) {
    return prisma.tipoUsuario.findUnique({
        where: {
            descricao: descricao,
        },
    });

}

async function createUser(userData) {
    return prisma.usuario.create({
        data: {
            nome: userData.nome,
            senha: userData.senha,
            email: userData.email,
            cpf: userData.cpf,
            data_nascimento: userData.data_nascimento,
            estado: {
                connect: { id_estado: userData.id_estado },
            },
            cidade: {
                connect: { id_cidade: userData.id_cidade },
            },
            tipoUsuario: {
                connect: { id_tipo_usuario: userData.tipoUsuarioId },
            },
        },
    });
}

export {findUserByEmail, findTypeUserByDescription, createUser, findUserByCpf}