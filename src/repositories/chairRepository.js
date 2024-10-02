import {create, deleteById, findAll, findByField, findByUnique, update} from "./genericRepository.js";

async function getAllChair() {
    return await findAll('cadeira', {
        sala: true,
        Ingresso: true
    });
}

async function getChairById(id) {
    return findByUnique('cadeira', 'id_cadeira', id, {
        sala: true,
        Ingresso: true,
    });
}

async function createChair(roomData) {
    return await create('cadeira', roomData);
}


async function updateChair(id, roomData) {
    return update('cadeira','id_cadeira', id, roomData,);
}

async function deleteChair(id) {
    return deleteById('cadeira','id_cadeira', id);
}

async function getChairsByRoomId(id_sala) {
    try {
        const chairs = await findByField('cadeira', 'id_sala', id_sala);
        return chairs;
    } catch (error) {
        console.error('Erro ao buscar cadeiras:', error);
        throw error;
    }
}

export { getAllChair, getChairById, createChair, updateChair, deleteChair, getChairsByRoomId};
