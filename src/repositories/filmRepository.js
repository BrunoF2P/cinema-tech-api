import prisma from '../../prismaClient.js';

async function generateUniqueSlug(titulo) {
    const baseSlug = generateSlug(titulo);
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await prisma.filme.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
}

function generateSlug(titulo) {
    return titulo
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');    // Remove caracteres especiais
}

async function createFilm (filmData) {
    return prisma.filme.create({ data: filmData.data});
}

async function getAllFilms ({skip = 0, take = 10 })  {
    const films = await prisma.filme.findMany({
        skip,
        take,
        include: {
            generos: true,
        },
    });

    const totalCount = await prisma.filme.count();

    return {
        films,
        totalCount,
    };
}

async function getFilmById(id) {
    return prisma.filme.findUnique({
        where: { id_filme: id },
        include: {
            generos: true,
        },
    });
}

async function searchFilmsByTitle  (title)  {
    return prisma.filme.findMany({
        where: {
            titulo: {
                contains: title,
            },
        },
    });
}

async function searchFilmsByAgeRating  ({ ageRating, skip = 0, take = 10 })  {
    const films = await prisma.filme.findMany({
        where: {
            classificacao_etaria: ageRating,
        },
        skip,
        take,
    });

    const totalCount = await prisma.filme.count({
        where: {
            classificacao_etaria: ageRating,
        },
    });

    return {
        films,
        totalCount,
    };
}

async function deleteFilm(id) {
    return prisma.filme.delete({
        where: { id_filme: id }
    });
}

async function updateFilm(id, filmData) {
    return prisma.filme.update({
        where: { id_filme: id },
        data: filmData,
    });
}

async function searchFilmsByGenre({ genreId, skip = 0, take = 10 }) {
    const films = await prisma.filme.findMany({
        where: {
            generos: {
                some: {
                    id_genero: genreId,
                },
            },
        },
        skip,
        take,
        include: {
            generos: true,
        },
    });

    const totalCount = await prisma.filme.count({
        where: {
            FilmeGenero: {
                some: {
                    id_genero: genreId,
                },
            },
        },
    });

    return {
        films,
        totalCount,
    };
}

export {createFilm, getAllFilms, getFilmById, searchFilmsByTitle, searchFilmsByAgeRating, deleteFilm, updateFilm, searchFilmsByGenre, generateUniqueSlug}