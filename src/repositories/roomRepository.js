import prisma from "../../prismaClient.js";
import {create, deleteById, findAll, findByUnique, update} from "./genericRepository.js";

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
    return findByUnique('sala', 'nome_sala', name);
}

async function addChairToRoom(id_sala, chairData) {
    const room = await getRoomById(id_sala);

    if (!room) {
        throw new Error("Sala não encontrada");
    }

    const newChair = await prisma.cadeira.create({
        data: {
            ...chairData,
            id_sala: id_sala,
        },
    });

    await updateRoom(id_sala, { capacidade: room.cadeiras.length + 1 });

    return newChair;
}

export { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom, getRoomByName, addChairToRoom };
