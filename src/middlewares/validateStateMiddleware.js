import { check, validationResult } from 'express-validator';

function validateStateOP(isOptional) {
    return [
        check('nome_estado')
            .optional(isOptional)
            .notEmpty().withMessage('Nome do estado é obrigatório')
            .isString().withMessage('Nome do estado deve ser um texto')
            .isLength({ min: 1 }).withMessage('Nome do estado deve ter pelo menos 1 caractere'),
        check('sigla_estado')
            .optional(isOptional)
            .notEmpty().withMessage('Sigla do estado é obrigatória')
            .isString().withMessage('Sigla do estado deve ser um texto')
            .isLength({ min: 2, max: 2 }).withMessage('Sigla do estado deve ter exatamente 2 caracteres'),
    ]

}

async function validateState (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ erro: errors.array() });
    }
    next();
}

const validateStateId = [
    check('id')
        .isInt({ gt: 0 })
        .withMessage('ID deve ser um número positivo'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ erro: errors.array() });
        }
        next();
    }
];

export { validateState, validateStateId, validateStateOP };