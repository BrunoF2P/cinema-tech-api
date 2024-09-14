import { check, validationResult } from 'express-validator';
import { findTypeUserByDescription } from '../repositories/userRepository.js';
import { isValidCPF, isValidName } from '../utils/validators.js';

const validationRegister = [
    check('nome').notEmpty().withMessage('Nome é obrigatório'),
    check('nome').isLength({ min: 6 }).withMessage('O nome deve ter pelo menos 6 caracteres'),
    check('nome').custom((value) => {
        if (!isValidName(value)) {
            throw new Error('Nome contém caracteres inválidos');
        }
        return true;
    }),
    check('email').isEmail().withMessage('Email inválido'),

    check('senha').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),

    check('re_senha').custom((value, { req }) => {
        if (value !== req.body.senha) {
            throw new Error('As senhas não coincidem');
        }
        return true;
    }),
    check('cpf').notEmpty().withMessage('CPF é obrigatório'),
    check('cpf').custom((value) => {
        if (!isValidCPF(value)) {
            throw new Error('CPF inválido');
        }
        return true;
    }),
    check('data_nascimento').notEmpty().withMessage('Data de nascimento é obrigatória')
        .isISO8601().withMessage('Data de nascimento deve estar no formato (YYYY-MM-DD)'),

    check('id_estado')
        .optional()
        .isInt().withMessage('ID de estado deve ser um número inteiro'),

    check('id_cidade')
        .optional()
        .isInt().withMessage('ID de cidade deve ser um número inteiro'),
];

async function validateTipeUser(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ erro: errors.array() });
    }

    try {
        const { codigo_ref } = req.body;

        // Determinar o tipo de usuário com base no código de referência
        let tipoUsuarioId;

        if (codigo_ref === 'LP3') {
            const tipoAdmin = await findTypeUserByDescription('Admin');
            tipoUsuarioId = tipoAdmin.id_tipo_usuario;
        } else if (codigo_ref === '') {
            const tipoCliente = await findTypeUserByDescription('Cliente');
            tipoUsuarioId = tipoCliente.id_tipo_usuario;
        } else {
            return res.status(400).json({ message: 'Código de referência inválido', path: "codigo_ref" });
        }

        req.body.tipoUsuarioId = tipoUsuarioId;

        check('tipoUsuarioId').isInt().withMessage('ID do tipo de usuário é obrigatório e deve ser um número');

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Falha ao validar usuário',path: "codigo_ref" });
    }
}

const validadeLogin = [
    check('email').isEmail().withMessage('Email inválido'),
    check('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')

];

export { validationRegister, validateTipeUser, validadeLogin };
