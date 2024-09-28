import { check, validationResult } from 'express-validator';


function validateRoomOP(isOptional) {
    return [
        check('nome_sala')
            .optional(isOptional)
            .notEmpty().withMessage('Nome da sala é obrigatório')
            .isString().withMessage('Nome da sala deve ser um texto'),
        check('id_tipo_sala')
            .optional(isOptional)
            .isInt({ gt: 0 }).withMessage('Tipo da sala deve ser um número positivo')
    ];
}


async function validateRoom(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ erro: errors.array() });
    }

    next();
}

const validateRoomId = [
    check('id')
        .isInt({ gt: 0 }).withMessage('ID da sala deve ser um número positivo'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ erro: errors.array() });
        }
        next();
    }
];

export { validateRoom, validateRoomId, validateRoomOP };
