import {findAll, findByUnique, create, update, deleteById} from "./genericRepository.js";


async function getAllTicketType() {
    return await findAll('TipoIngresso')
}

async function getTicketTypeById(id){
    return await findByUnique('TipoIngresso', 'id_tipo', id)
}

async function getTicketTypeByDescription(descricao) {
    return await findByUnique('TipoIngresso', 'descricao', descricao);
}

async function createTicketType(ticketTypeData){
    return await create('TipoIngresso', ticketTypeData);
}

async function updateTicketType(id, typeTicketData){
    return await update('TipoIngresso', 'id_tipo', id, typeTicketData)
}

async function deleteTicketType(id){
    return deleteById('TipoIngresso', 'id_tipo', id)
}

export {getAllTicketType, getTicketTypeById, getTicketTypeByDescription, createTicketType, updateTicketType, deleteTicketType}