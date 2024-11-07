import { body } from 'express-validator';
import { check, validationResult } from 'express-validator';
import { findTypeUserByDescription } from '../repositories/userRepository.js';
import { isValidCPF, isValidName } from '../utils/validators.js';
import { validateErrors } from './genericMiddleware.js';

// Função para formatar erros
function formatErrors(errors) {
    return errors.array().reduce((acc, error) => {
        acc[error.param] = { msg: error.msg, path: error.param };
        return acc;
    }, {});
}

const validationRegister = [
    body('nome')
        .notEmpty().withMessage('Nome é obrigatório')
        .isLength({ min: 6 }).withMessage('O nome deve ter pelo menos 6 caracteres')
        .custom((value) => {
            if (!isValidName(value)) {
                throw new Error('Nome contém caracteres inválidos');
            }
            return true;
        }),

    body('email')
        .isEmail().withMessage('Email inválido'),

    body('senha')
        .isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),

    body('re_senha')
        .custom((value, { req }) => {
            if (value !== req.body.senha) {
                throw new Error('As senhas não coincidem');
            }
            return true;
        }),

    body('cpf')
        .notEmpty().withMessage('CPF é obrigatório')
        .custom((value) => {
            if (!isValidCPF(value)) {
                throw new Error('CPF inválido');
            }
            return true;
        }),

    body('data_nascimento')
        .notEmpty().withMessage('Data de nascimento é obrigatória')
        .isISO8601().withMessage('Data de nascimento deve estar no formato (YYYY-MM-DD)'),

    body('id_estado')
        .isInt().withMessage('ID de estado deve ser um número inteiro'),

    body('id_cidade')
        .isInt().withMessage('ID de cidade deve ser um número inteiro'),

    validateErrors
];

async function validateTipeUser(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            ...formatErrors(errors)
        });
    }

    try {
        const { codigo_ref } = req.body;
        let tipoUsuarioId = null;

        // Determina o tipo de usuário com base no código de referência
        if (codigo_ref === 'LP3') {
            const tipoAdmin = await findTypeUserByDescription('Admin');
            tipoUsuarioId = tipoAdmin.id_tipo_usuario;
        } else if (!codigo_ref) {
            const tipoCliente = await findTypeUserByDescription('Cliente');
            tipoUsuarioId = tipoCliente.id_tipo_usuario;
        } else {
            return res.status(400).json({
                success: false,
                msg: 'Código de referência inválido',
                path: 'codigo_ref'
            });
        }

        req.body.tipoUsuarioId = tipoUsuarioId;

        // Valida o tipo de usuário
        body('tipoUsuarioId')
            .isInt().withMessage('ID do tipo de usuário é obrigatório e deve ser um número');

        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            msg: 'Falha ao validar usuário',
            path: 'codigo_ref'
        });
    }
}

const validadeLogin = [
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
    validateErrors
];

export { validationRegister, validateTipeUser, validadeLogin, validateErrors };
