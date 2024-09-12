import prisma from '../../prismaClient.js';

async function generateUniqueSlug(title) {
    const baseSlug = generateSlug(title);
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await prisma.filme.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
}

function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');    // Remove caracteres especiais
}
async function createFilm (filmData) {
    const slug = await generateUniqueSlug(filmData.titulo);
    return prisma.filme.create({ data: filmData.data, slug });
}

async function getAllFilms   ({skip = 0, take = 10 })  {
    const films = await prisma.filme.findMany({
        skip,
        take,
    });

    const totalCount = await prisma.filme.count();

    return {
        films,
        totalCount,
    };
}

async function getFilmById(id) {
    return prisma.filme.findUnique({
        where: { id_filme: id }
    });
}

async function searchFilmsByTitle  (title)  {
    return prisma.filme.findMany({
        where: {
            titulo: {
                contains: title,
                mode: 'insensitive',
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
    const slug = await generateUniqueSlug(filmData.titulo);
    return prisma.filme.update({
        where: { id_filme: id },
        data: {
            ...filmData,
            slug
        }
    });
}

export {createFilm, getAllFilms, getFilmById, searchFilmsByTitle, searchFilmsByAgeRating, deleteFilm, updateFilm}