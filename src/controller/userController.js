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


        const payload = { userId: novoUsuario.id_usuario };
        const config = jwtConfig();
        const token = jwt.sign(payload, config.secret, {
            expiresIn: config.expiresIn,
            algorithm: config.algorithm,
        });

        res.json({ success: true, message: 'Usuário cadastrado com sucesso', token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Falha ao cadastrar o usuário' });
    }
}
export {registerUser};