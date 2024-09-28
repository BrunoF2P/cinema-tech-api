import { check, validationResult } from 'express-validator';


function validateGenreOP(isOptional) {
    return [
        check('nome_genero')
            .optional(isOptional)
            .notEmpty().withMessage('Nome do gênero é obrigatório')
            .isLength({ min: 1 }).withMessage('Nome do gênero deve ter pelo menos 1 caractere')
            .isString().withMessage('Nome do gênero deve ser um texto')
    ];
}

async function validateGenre(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ erro: errors.array() });
    }

    next();
}

const validateGenreId = [
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

export {validateGenre, validateGenreId, validateGenreOP };