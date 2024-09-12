import prisma from "../../prismaClient.js";

async function getAllGenres() {
    return prisma.genero.findMany();
}

async function getGenreById(id) {
    return prisma.genero.findUnique({
        where: { id_genero: id },
    });
}

export { getAllGenres, getGenreById };