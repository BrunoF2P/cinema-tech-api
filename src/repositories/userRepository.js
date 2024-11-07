import prisma from '../../prismaClient.js';
import {findByUnique} from "./genericRepository.js";

async function findUserByEmail  (email) {
    return findByUnique('usuario', 'email', email);
}

async function findUserByCpf(cpf) {
    return findByUnique('usuario', 'cpf', cpf);
}

async function findTypeUserByDescription(descricao) {
    return findByUnique('tipoUsuario', 'descricao', descricao);
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
                connect: { id_tipo_usuario: userData.codigo_ref },
            },
        },
    });
}

export {findUserByEmail, findTypeUserByDescription, createUser, findUserByCpf}