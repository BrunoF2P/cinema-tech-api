import {body, param} from 'express-validator';
import {getTicketTypeByDescription} from "../repositories/ticketTypeRepository.js";
import {validateErrors} from "./genericMiddleware.js";


function validateTicketType(isOptional) {
    return [
        body('descricao')
            .optional(isOptional)
            .isString()
            .isLength({min: 1, max: 50})
            .withMessage('A descrição deve ser um texto de 1 a 50 caracteres.')
            .trim()
            .escape()
            .custom(async (descricao) => {
                const existingItem = await getTicketTypeByDescription(descricao);
                if (existingItem) {
                    return Promise.reject('Descrição já existe.');
                }
            }),
        validateErrors
    ];
}

const validateTicketTypeId = [
    param('id_tipo')
        .isInt({gt: 0})
        .withMessage('O ID do tipo de ingresso deve ser um número inteiro positivo.'),
    validateErrors
];

export {validateTicketType, validateTicketTypeId};
