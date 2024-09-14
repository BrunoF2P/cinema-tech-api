import prisma from "../../prismaClient.js";

async function getAllGenres() {
    return prisma.genero.findMany();
}

async function getGenreById(id) {
    return prisma.genero.findUnique({
        where: { id_genero: id },
    });
}

async function createGenre(genreData) {
    return prisma.genero.create({
        data: genreData,
    });
}

async function getGenreByName(name) {
    return prisma.genero.findUnique({
        where: { nome_genero: name },
    });
}


async function updateGenre(id, genreData) {
    return prisma.genero.update({
        where: { id_genero: id },
        data: genreData,
    });
}

async function deleteGenre(id) {
    return prisma.genero.delete({
        where: { id_genero: id },
    });
}

export { getAllGenres, getGenreById, createGenre, updateGenre, deleteGenre, getGenreByName};
