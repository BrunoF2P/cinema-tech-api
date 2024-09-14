import prisma from "../../prismaClient.js";

async function getAllCities() {
    return prisma.cidade.findMany({
        include: {
            estado: true,
        },
    });
}

async function getCityById(id) {
    return prisma.cidade.findUnique({
        where: { id_cidade: id },
        include: {
            estado: true,
        },
    });
}

async function createCity(cityData) {
    return prisma.cidade.create({
        data: cityData,
    });
}

async function updateCity(id, cityData) {
    return prisma.cidade.update({
        where: { id_cidade: id },
        data: cityData,
    });
}

async function deleteCity(id) {
    return prisma.cidade.delete({
        where: { id_cidade: id },
    });
}

async function getCitiesByStateId(stateId) {
    return prisma.cidade.findMany({
        where: { id_estado: stateId },
    });
}

export { getAllCities, getCityById, createCity, updateCity, deleteCity, getCitiesByStateId };
