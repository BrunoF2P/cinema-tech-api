import bcrypt from 'bcryptjs'
import {findUserByEmail, createUser, findUserByCpf} from '../repositories/userRepository.js'
import jwt from 'jsonwebtoken';
import {jwtConfig} from '../bin/jwtConfig.js';
import {getStateById} from "../repositories/stateRepository.js";
import {getCityById} from "../repositories/cityRepository.js";

async function registerUser(req, res) {
    const { nome, senha, email, cpf, data_nascimento, id_estado, id_cidade, codigo_ref } = req.body;

    try {

        // Verifica cpf já possui cadastro
        const cpfExist = await findUserByCpf(cpf);
        if (cpfExist) {
            return res.status(400).json({ success: false, msg: 'CPF já está cadastrado', path: 'cpf' });
        }

        // Verifica se o email está cadastrado
        const emailExist = await findUserByEmail(email);
        if (emailExist) {
            return res.status(400).json({ success: false, msg: 'Email já possui cadastro', path: 'email' });
        }

        // Verifica se existe estado
        const stateExist = await getStateById(id_estado);
        if (!stateExist) {
            return res.status(400).json({ success: false, msg: 'Estado não encontrada', path: 'endereco' });
        }

        // Verifica se a cidade existe
        const cityExist = await getCityById(id_cidade);
        if (!cityExist) {
            return res.status(400).json({ success: false, msg: 'Cidade não encontrada', path: 'endereco' });
        }

        // Verifica se a cidade está relacionada com o estado
        if (cityExist.id_estado !== stateExist.id_estado) {
            return res.status(400).json({ success: false, msg: 'Cidade não pertence ao estado fornecido', path: 'endereco' });
        }


        const senhaHash = await bcrypt.hash(senha, 10);

        const userData = await createUser ({
            nome,
            senha: senhaHash,
            email,
            cpf,
            data_nascimento: new Date(data_nascimento),
            id_estado,
            id_cidade,
            codigo_ref,
        })


        const payload = { userId: userData.id_usuario, role: userData.tipoUsuario  };
        const config = jwtConfig();
        const token = jwt.sign(payload, config.secret, {
            expiresIn: config.expiresIn,
            algorithm: config.algorithm,
        });

        res.cookie('token', token, {
            httpOnly: false,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
            partitioned: true
        });
        res.status(201).json({ success: true, msg: 'Usuário cadastrado com sucesso', token });

    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, msg: 'Falha ao cadastrar o usuário' });
    }
}


async function loginUser(req, res) {
    const { email, senha } = req.body;

    try {
        // Verifica se o email está cadastrado
        const usuario = await findUserByEmail(email);
        if (!usuario) {
            return res.status(400).json({ success: false, msg: 'Email não encontrado', path: 'email' });
        }

        // Verifica a senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ success: false, msg: 'Senha incorreta', path: 'senha' });
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

        res.cookie('token', token, {
            httpOnly: false,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
            partitioned: true
        });


        res.json({ success: true, msg: 'Login bem-sucedido', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Falha ao realizar login' });
    }
}
export {registerUser, loginUser};
