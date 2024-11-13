import { check, validationResult } from 'express-validator';
import {getGenreById} from "../repositories/genreRepository.js";


function validationFilmOP(isOptional) {

    return [
        check('titulo')
            .optional(isOptional)
            .notEmpty().withMessage('Título é obrigatório')
            .isLength({ min: 1 }).withMessage('Título deve ter pelo menos 1 caractere'),

        check('sinopse')
            .optional(isOptional)
            .notEmpty().withMessage('Sinopse é obrigatória'),

        check('data_lancamento')
            .optional(isOptional)
            .notEmpty().withMessage('Data de lançamento é obrigatória')
            .isISO8601().withMessage('Data de lançamento deve estar no formato (YYYY-MM-DD)'),

        check('duracao')
            .optional(isOptional)
            .notEmpty().withMessage('Duração é obrigatória')
            .isInt({ gt: 0 }).withMessage('Duração deve ser um número inteiro positivo'),

        check('generos').optional(isOptional).isArray().withMessage('Gêneros não pode ser vazio'),
        check('generos').optional(isOptional).custom(async (generoIds) => {
            if (generoIds.length === 0) {
                throw new Error('Pelo menos um gênero deve ser fornecido.');
            }
            for (const id of generoIds) {
                if (!Number.isInteger(id)) {
                    throw new Error('O ID de gênero deve ser um número.');
                }
                const genre = await getGenreById(id); // Verifica se o gênero existe
                if (!genre) {
                    throw new Error(`Gênero não encontrado.`);
                }
            }
            return true;
        }),
        check('classificacao_etaria')
            .optional(isOptional).notEmpty().withMessage('Classificação etária é obrigatória'),

        check('trailer_url')
            .optional(isOptional)
            .isString().withMessage('A URL do trailer deve ser uma parte do link do YouTube trailer'),

        check('nota_imdb')
            .optional(isOptional)
            .isFloat({ min: 0, max: 10 }).withMessage('Nota IMDb deve ser um número entre 0 e 10'),
    ];

}

async function validateFilm(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
}

const validateFilmId = [
    check('id')
        .isInt({ gt: 0 })
        .withMessage('ID deve ser um número inteiro positivo'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export { validationFilmOP, validateFilm, validateFilmId};
