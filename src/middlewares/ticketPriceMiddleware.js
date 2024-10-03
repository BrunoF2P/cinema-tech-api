import { body, param } from 'express-validator';
import { validateErrors } from './genericMiddleware.js';
import { getSessionById } from '../repositories/sessionRepository.js';
import { getTicketTypeById } from '../repositories/ticketTypeRepository.js';
import {getTicketPriceById} from "../repositories/ticketPriceRepository.js";

function validateTicketPrice(isOptional) {
    return [
        body('id_sessao')
            .optional(isOptional)
            .isInt({ gt: 0 })
            .withMessage('O ID da sessão deve ser um número inteiro positivo.')
            .bail()
            .custom(async (id_sessao) => {
                const existingSession = await getSessionById(id_sessao);
                if (!existingSession) {
                    return Promise.reject('Sessão não encontrada.');
                }
            }),
        body('id_tipo')
            .optional(isOptional)
            .isInt({ gt: 0 })
            .withMessage('O ID do tipo de ingresso deve ser um número inteiro positivo.')
            .bail()
            .custom(async (id_tipo_ingresso) => {
                const existingTicketType = await getTicketTypeById(id_tipo_ingresso);
                if (!existingTicketType) {
                    return Promise.reject('Tipo de ingresso não encontrado.');
                }
            }),
        body('preco')
            .optional(isOptional)
            .isFloat({ gt: 0 })
            .withMessage('O preço deve ser um número positivo maior que zero.'),
        validateErrors
    ];
}

const validateTicketPriceId = [
    param('id_preco')
        .isInt({ gt: 0 })
        .withMessage('O ID do preço do ingresso deve ser um número inteiro positivo.')
        .custom(async (id_preco_ingresso) => {
            const existingTicketPrice = await getTicketPriceById(parseInt(id_preco_ingresso)); // Função fictícia
            if (!existingTicketPrice) {
                return Promise.reject('Preço do ingresso não encontrado.');
            }
        }),
    validateErrors
];

export { validateTicketPrice, validateTicketPriceId };
