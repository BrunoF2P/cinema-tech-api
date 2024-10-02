import {body, param} from 'express-validator';
import {validateErrors} from "./genericMiddleware.js";
import {getTypeRoomByDescription} from "../repositories/typeRoomRepository.js";


function validateTypeRoomOP(isOptional) {
    return [
        body('descricao')
            .optional(isOptional)
            .notEmpty().withMessage('Descricao do tipe de sala é obrigatório')
            .isLength({min: 1}).withMessage('Descricao do tipe de sala  deve ter pelo menos 1 caractere')
            .isString().withMessage('Descricao do tipe de sala deve ser um texto')
            .custom(async (descricao) => {
                const existingItem = await getTypeRoomByDescription(descricao);
                if (existingItem) {
                    return Promise.reject('Descrição já existe.');
                }
            }),
        validateErrors
    ];
}

const validateTypeRoomId = [
    param('id_tipo_sala')
        .isInt({gt: 0})
        .withMessage('ID deve ser um número positivo'),
    validateErrors
];

export {validateTypeRoomId, validateTypeRoomOP};