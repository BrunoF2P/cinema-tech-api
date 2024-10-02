import {body, param, query} from 'express-validator';
import { validateErrors } from './genericMiddleware.js';
import {getRoomById} from "../repositories/roomRepository.js";
import {getFilmById} from "../repositories/filmRepository.js";
import {getSessionById} from "../repositories/sessionRepository.js";

function validateSession  (isOptional)  {
    return [
        body('id_filme')
            .optional(isOptional)
            .isInt({ gt: 0 })
            .withMessage('O ID do filme deve ser um número inteiro positivo.')
            .bail()
            .custom(async (id_filme) => {
                const existingMovie = await getFilmById(id_filme);
                if (!existingMovie) {
                    return Promise.reject('Filme não encontrado.');
                }
            }),
        body('id_sala')
            .optional(isOptional)
            .isInt({ gt: 0 })
            .withMessage('O ID da sala deve ser um número inteiro positivo.')
            .bail()
            .custom(async (id_sala) => {
                const existingRoom = await getRoomById(id_sala);
                if (!existingRoom) {
                    return Promise.reject('Sala não encontrada.');
                }
            }),
        body('data_sessao')
            .optional(isOptional)
            .isISO8601()
            .toDate()
            .withMessage('A data da sessão deve ser uma data válida (formato ISO 8601).')
            .isAfter()
            .withMessage('A data da sessão deve ser uma data futura.'),
        validateErrors
    ];
}

const validateSessionId = [
    param('id_sessao')
        .isInt({ gt: 0 })
        .withMessage('O ID da sessão deve ser um número inteiro positivo.')
        .custom(async (id_sessao) => {
            const existingSession = await getSessionById(parseInt(id_sessao)); // Conversão para inteiro
            if (!existingSession) {
                return Promise.reject('Sessão não encontrada.');
            }
        }),
    validateErrors
];

const validateSessionDateRange = [
    query('startDate')
        .isISO8601()
        .withMessage('A data inicial deve estar no formato ISO8601 (YYYY-MM-DD).')
        .isAfter()
        .withMessage('A data inicial deve ser uma data futura.'),
    query('endDate')
        .isISO8601()
        .withMessage('A data final deve estar no formato ISO8601 (YYYY-MM-DD).')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.query.startDate)) {
                throw new Error('A data de término deve ser posterior à data de início.');
            }
            return true;
        }),
    validateErrors
];

const validateSessionMovieId = [
    param('id_filme')
        .isInt({ gt: 0 })
        .withMessage('O ID do filme deve ser um número inteiro positivo.')
        .custom(async (id_filme) => {
            const existingMovie = await getFilmById(parseInt(id_filme));
            if (!existingMovie) {
                return Promise.reject('Filme não encontrado.');
            }
        }),
    validateErrors
];

export { validateSession, validateSessionId, validateSessionMovieId, validateSessionDateRange };
