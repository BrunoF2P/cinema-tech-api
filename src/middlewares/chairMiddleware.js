import {body, param} from 'express-validator';
import {validateErrors} from "./genericMiddleware.js";

function validationChairOP(isOptional) {
    return [
        param('*.id_sala')
            .optional(isOptional)
            .isInt({min: 1})
            .withMessage('O ID da sala deve ser um número inteiro positivo.'),

        body('*.linha')
            .optional(isOptional)
            .isString()
            .isLength({min: 1, max: 1})
            .matches(/^[A-Z]$/)
            .withMessage('A linha deve ser uma única letra de A a Z.'),

        body('*.numero')
            .optional(isOptional)
            .isInt({min: 1, max: 99})
            .withMessage('O número da cadeira deve ser um número entre 1 e 99.'),

        validateErrors
    ];
}


const validateChairId = [
    body('*.id_cadeira')
        .isInt({min: 1})
        .withMessage('O ID da cadeira deve ser um número inteiro positivo.'),

    validateErrors
];

export {validationChairOP, validateChairId};
