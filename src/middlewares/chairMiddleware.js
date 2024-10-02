import {body, check, param, validationResult} from 'express-validator';

function validationChairOP(isOptional) {
    return [
        param('*.id_sala')
            .optional(isOptional)
            .isInt({ min: 1 })
            .withMessage('O ID da sala deve ser um número inteiro positivo.'),

        body('*.linha')
            .optional(isOptional)
            .isString()
            .isLength({ min: 1, max: 1 })
            .matches(/^[A-Z]$/)
            .withMessage('A linha deve ser uma única letra de A a Z.'),

        body('*.numero')
            .optional(isOptional)
            .isInt({ min: 1, max: 99 })
            .withMessage('O número da cadeira deve ser um número entre 1 e 99.'),

        async (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.error(errors);
                return res.status(400).json({ erro: errors.array() });
            }
            next();
        }
    ];
}


const validateChairId = [
    body('*.id_cadeira')
        .isInt({ min: 1 })
        .withMessage('O ID da cadeira deve ser um número inteiro positivo.'),

    // Verificação de erros
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ erro: errors.array() });
        }
        next();
    }
];

export { validationChairOP, validateChairId };
