import prisma from "../../prismaClient.js";

async function getAllStates() {
    return prisma.estado.findMany();
}

async function getStateById(id) {
    return prisma.estado.findUnique({
        where: { id_estado: id },
    });
}

async function createState(stateData) {
    return prisma.estado.create({
        data: stateData,
    });
}

async function getStateByName(name) {
    return prisma.estado.findUnique({
        where: { nome_estado: name },
    });
}


async function updateState(id, stateData) {
    return prisma.estado.update({
        where: { id_estado: id },
        data: stateData,
    });
}

async function deleteState(id) {
    return prisma.estado.delete({
        where: { id_estado: id },
    });
}

export { getAllStates, getStateById, createState, updateState, deleteState, getStateByName};
