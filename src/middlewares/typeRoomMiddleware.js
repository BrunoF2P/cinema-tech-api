import { check, validationResult } from 'express-validator';


function validateTypeRoomOP(isOptional) {
    return [
        check('descricao')
            .optional(isOptional)
            .notEmpty().withMessage('Descricao do tipe de sala é obrigatório')
            .isLength({ min: 1 }).withMessage('Descricao do tipe de sala  deve ter pelo menos 1 caractere')
            .isString().withMessage('Descricao do tipe de sala deve ser um texto')
    ];
}

async function validateTypeRoom(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ erro: errors.array() });
    }

    next();
}

const validateTypeRoomId = [
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

export {validateTypeRoom, validateTypeRoomId, validateTypeRoomOP };