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

async function createUser (userData) {
    return prisma.usuario.create({
        data: userData,
    });
}

export {findUserByEmail, findTypeUserByDescription, createUser, findUserByCpf}