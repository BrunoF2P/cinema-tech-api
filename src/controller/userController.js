import {validationResult} from 'express-validator';
import bcrypt from 'bcryptjs'
import {findUserByEmail, createUser, findUserByCpf} from '../repositories/userRepository.js'
import jwt from 'jsonwebtoken';
import {jwtConfig} from '../bin/jwtConfig.js';

async function registerUser(req, res) {
    const { nome, senha, email, cpf, data_nascimento, enderecoId, tipoUsuarioId } = req.body;

    // Valida os campos de entrada
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        return res.status(400).json({ erro: validation.array() });
    }

    try {

        // Verifica cpf já possui cadastro
        const cpfExiste = await findUserByCpf(cpf);
        if (cpfExiste) {
            return res.status(400).json({ msg: 'CPF já está cadastrado', path: 'cpf' });
        }

        // Verifica se o email está cadastrado
        const emailExiste = await findUserByEmail(email);
        if (emailExiste) {
            return res.status(400).json({ msg: 'Email já possui cadastro', path: 'email' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const userData = await createUser ({
            nome,
            senha: senhaHash,
            email,
            cpf,
            data_nascimento: new Date(data_nascimento),
            ...(enderecoId ? { endereco: { connect: { id_endereco: enderecoId } } } : {}),
            tipoUsuario: {
                connect: { id_tipo_usuario: tipoUsuarioId },
            },
        })


        const payload = { userId: userData.id_usuario, role: userData.tipoUsuario  };
        const config = jwtConfig();
        const token = jwt.sign(payload, config.secret, {
            expiresIn: config.expiresIn,
            algorithm: config.algorithm,
        });

        res.json({ success: true, msg: 'Usuário cadastrado com sucesso', token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Falha ao cadastrar o usuário' });
    }
}


async function loginUser(req, res) {
    const { email, senha } = req.body;

    // Valida os campos de entrada
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        return res.status(400).json({ erro: validation.array() });
    }

    try {
        // Verifica se o email está cadastrado
        const usuario = await findUserByEmail(email);
        if (!usuario) {
            return res.status(400).json({ msg: 'Email não encontrado', path: 'email' });
        }

        // Verifica a senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ msg: 'Senha incorreta', path: 'senha' });
        }

        // Cria o payload com base no usuário
        const payload = {
            userId: usuario.id_usuario,
            role: usuario.tipoUsuario // Supondo que tipoUsuario está disponível aqui
        };

        // Configuração do JWT
        const config = jwtConfig();
        const token = jwt.sign(payload, config.secret, {
            expiresIn: config.expiresIn,
            algorithm: config.algorithm,
        });

        res.json({ success: true, msg: 'Login bem-sucedido', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Falha ao realizar login' });
    }
}
export {registerUser, loginUser};