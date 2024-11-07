import { check, validationResult } from 'express-validator';


function validateCityOP(isOptional) {
    return [
        check('nome_cidade')
            .optional(isOptional)
            .notEmpty().withMessage('Nome da cidade é obrigatório')
            .isString().withMessage('Nome da cidade deve ser um texto')
            .isLength({ min: 1 }).withMessage('Nome da cidade deve ter pelo menos 1 caractere'),
        check('id_estado')
            .optional(isOptional)
            .isInt({ gt: 0 }).withMessage('ID do estado deve ser um número positivo'),
    ];
}

async function validateCity(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

const validateCityId = [
    check('id')
        .isInt({ gt: 0 })
        .withMessage('ID deve ser um número positivo'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export { validateCity, validateCityId, validateCityOP };
