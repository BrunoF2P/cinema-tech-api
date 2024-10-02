import {create, deleteById, findAll, findByUnique, update} from "./genericRepository.js";
import {createChair, deleteChair, getChairById} from "./chairRepository.js";

async function getAllRooms() {

    return await findAll('sala', {
            cadeiras: true,
            tipoSala: true
        });
}

async function getRoomById(id) {
    return findByUnique('sala', 'id_sala', id, {
        cadeiras: true,
        tipoSala: true,
    });
}

async function createRoom(roomData) {
        return await create('sala', roomData);
}


async function updateRoom(id, roomData) {
    return update('sala','id_sala', id, roomData,);
}

async function deleteRoom(id) {
    return deleteById('sala','id_sala', id);
}

async function getRoomByName(name) {
    return  findByUnique('sala', 'nome_sala', name);
}

async function addChairToRoom(id_sala, linha, numero) {
    const room = await findByUnique('sala','id_sala', id_sala);

    if (!room) {
        throw new Error('Sala não encontrada');
    }

    // Cria a nova cadeira
    const newChair = await createChair({
            id_sala,
            linha,
            numero,
    });

    // Atualiza a capacidade da sala
    const updatedRoom = await update('sala', 'id_sala', id_sala, {
        capacidade: {
            increment: 1, // Incrementa a capacidade em 1
        },
    });

    return { updatedRoom, newChair };
}
async function removeChairFromRoom(id_cadeira) {
    const chair = await getChairById(id_cadeira);

    if (!chair) {
        throw new Error('Cadeira não encontrada.');
    }

    await deleteChair(id_cadeira);

    const updatedRoom = await update('sala', 'id_sala', chair.id_sala, {
        capacidade: {
            decrement: 1,
        },
    });

    return updatedRoom;
}

export { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom, getRoomByName, addChairToRoom, removeChairFromRoom };
