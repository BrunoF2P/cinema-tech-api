import prisma from '../../prismaClient.js';
import {findByUnique} from "./genericRepository.js";
import  { CryptoService } from "../utils/cryptoService.js";

async function findUserByEmail  (email) {
    const emailHash = CryptoService.generateHash(email);
    return findByUnique('usuario', 'email_hash', emailHash);
}

async function findUserByCpf(cpf) {
    const cpfHash = CryptoService.generateHash(cpf);
    return findByUnique('usuario', 'cpf_hash', cpfHash);
}

async function findTypeUserByDescription(descricao) {
    return findByUnique('tipoUsuario', 'descricao', descricao);
}

async function createUser(userData){

// Criptografando o CPF e gerando o hash
const { iv: ivCpf, encryptedCpf } = CryptoService.encryptCpf(userData.cpf);
const cpfHash = CryptoService.generateHash(userData.cpf);

// Criptografando o E-mail e gerando o hash
const { iv: ivEmail, encryptedEmail } = CryptoService.encryptEmail(userData.email); // Usando a mesma função para criptografar o email
const emailHash = CryptoService.generateHash(userData.email);

    return prisma.usuario.create({
        data: {
            nome: userData.nome,
            senha: userData.senha,
            cpf_hash: cpfHash,  // Armazenando o hash do CPF para pesquisa
            cpf: encryptedCpf,  // Armazenando o CPF criptografado
            iv_cpf: ivCpf,  // Armazenando o IV necessário para descriptografar o CPF
            email: encryptedEmail,
            email_hash: emailHash, // Armazenando o hash do E-mail
            iv_email: ivEmail,
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