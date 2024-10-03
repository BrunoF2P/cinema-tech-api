import {findAll, findByUnique, create, update, deleteById, checkField} from "./genericRepository.js";

async function getAllTicketPrices() {
    return await findAll('PrecoIngresso');
}

async function getTicketPriceById(id) {
    return await findByUnique('PrecoIngresso', 'id_preco', id);
}

async function getTicketPriceBySessionId(id_sessao) {
    return await findByUnique('PrecoIngresso', 'id_sessao', id_sessao);
}

async function getTicketPriceByType(id_tipo) {
    return await findByUnique('PrecoIngresso', 'id_tipo', id_tipo);
}

async function doesTicketPriceExist(id_sessao, id_tipo) {
    return await checkField('PrecoIngresso', {
        id_sessao: id_sessao,
        id_tipo: id_tipo
    });
}

async function createTicketPrice(ticketPriceData) {
    return await create('PrecoIngresso', ticketPriceData);
}

async function updateTicketPrice(id, ticketPriceData) {
    return await update('PrecoIngresso', 'id_preco', id, ticketPriceData);
}

async function deleteTicketPrice(id) {
    return await deleteById('PrecoIngresso', 'id_preco', id);
}

export {getAllTicketPrices, getTicketPriceById, getTicketPriceBySessionId, getTicketPriceByType, doesTicketPriceExist, createTicketPrice, updateTicketPrice, deleteTicketPrice};
