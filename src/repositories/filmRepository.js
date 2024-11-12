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

async function createFilm(filmData) {
    return prisma.filme.create({ data: filmData.data });
}

async function getAllFilms({ skip = 0, take = 10 }) {
    const films = await prisma.filme.findMany({
        skip,
        take,
        include: {
            FilmeGenero: {
                select: {
                    genero: {
                        select: {
                            id_genero: true,
                            nome_genero: true,
                        },
                    },
                },
            },
        },
    });

    const totalCount = await prisma.filme.count();

    // Reestruturar a resposta para incluir apenas os nomes e ids dos gêneros
    const formattedFilms = films.map(film => {
        const generos = film.FilmeGenero.map(fg => ({
            id_genero: fg.genero.id_genero,
            nome_genero: fg.genero.nome_genero,
        }));

        // Retorna o filme formatado sem a propriedade FilmeGenero
        return {
            id_filme: film.id_filme,
            id_api: film.id_api,
            titulo: film.titulo,
            slug: film.slug,
            sinopse: film.sinopse,
            data_lancamento: film.data_lancamento,
            duracao: film.duracao,
            classificacao_etaria: film.classificacao_etaria,
            poster_path: film.poster_path,
            trailer_url: film.trailer_url,
            nota_imdb: film.nota_imdb,
            generos: generos,
        };
    });

    return {
        films: formattedFilms,
        totalCount,
    };
}

async function getFilmById(id) {
    const film = await prisma.filme.findUnique({
        where: { id_filme: id },
        include: {
            FilmeGenero: {
                select: {
                    genero: {
                        select: {
                            id_genero: true,
                            nome_genero: true,
                        },
                    },
                },
            },
        },
    });

    if (!film) return null;

    const generos = film.FilmeGenero.map(fg => ({
        id_genero: fg.genero.id_genero,
        nome_genero: fg.genero.nome_genero,
    }));

    return {
        id_filme: film.id_filme,
        id_api: film.id_api,
        titulo: film.titulo,
        slug: film.slug,
        sinopse: film.sinopse,
        data_lancamento: film.data_lancamento,
        duracao: film.duracao,
        classificacao_etaria: film.classificacao_etaria,
        poster_path: film.poster_path,
        trailer_url: film.trailer_url,
        nota_imdb: film.nota_imdb,
        generos: generos,
    };
}

async function searchFilmsByTitle(title) {
    const films = await prisma.filme.findMany({
        where: {
            titulo: {
                contains: title,
            },
        },
        include: {
            FilmeGenero: {
                select: {
                    genero: {
                        select: {
                            id_genero: true,
                            nome_genero: true,
                        },
                    },
                },
            },
        },
    });

    const formattedFilms = films.map(film => {
        const generos = film.FilmeGenero.map(fg => ({
            id_genero: fg.genero.id_genero,
            nome_genero: fg.genero.nome_genero,
        }));

        return {
            id_filme: film.id_filme,
            id_api: film.id_api,
            titulo: film.titulo,
            slug: film.slug,
            sinopse: film.sinopse,
            data_lancamento: film.data_lancamento,
            duracao: film.duracao,
            classificacao_etaria: film.classificacao_etaria,
            poster_path: film.poster_path,
            trailer_url: film.trailer_url,
            nota_imdb: film.nota_imdb,
            generos: generos,
        };
    });

    return formattedFilms;
}

async function updateFilm(id, updateData) {
    const updatedFilm = await prisma.filme.update({
        where: { id_filme: id },
        data: updateData,
        include: {
            FilmeGenero: {
                select: {
                    genero: {
                        select: {
                            id_genero: true,
                            nome_genero: true,
                        },
                    },
                },
            },
        },
    });

    const generos = updatedFilm.FilmeGenero.map(fg => ({
        id_genero: fg.genero.id_genero,
        nome_genero: fg.genero.nome_genero,
    }));

    return {
        id_filme: updatedFilm.id_filme,
        id_api: updatedFilm.id_api,
        titulo: updatedFilm.titulo,
        slug: updatedFilm.slug,
        sinopse: updatedFilm.sinopse,
        data_lancamento: updatedFilm.data_lancamento,
        duracao: updatedFilm.duracao,
        classificacao_etaria: updatedFilm.classificacao_etaria,
        poster_path: updatedFilm.poster_path,
        trailer_url: updatedFilm.trailer_url,
        nota_imdb: updatedFilm.nota_imdb,
        generos: generos,
    };
}

async function searchFilmsByGenre(genreId, skip = 0, take = 10) {
    const films = await prisma.filme.findMany({
        where: {
            FilmeGenero: {
                some: {
                    genero: {
                        id_genero: genreId,
                    },
                },
            },
        },
        skip,
        take,
        include: {
            FilmeGenero: {
                select: {
                    genero: {
                        select: {
                            id_genero: true,
                            nome_genero: true,
                        },
                    },
                },
            },
        },
    });

    const totalCount = await prisma.filme.count({
        where: {
            FilmeGenero: {
                some: {
                    genero: {
                        id_genero: genreId,
                    },
                },
            },
        },
    });

    const formattedFilms = films.map(film => {
        const generos = film.FilmeGenero.map(fg => ({
            id_genero: fg.genero.id_genero,
            nome_genero: fg.genero.nome_genero,
        }));

        return {
            id_filme: film.id_filme,
            id_api: film.id_api,
            titulo: film.titulo,
            slug: film.slug,
            sinopse: film.sinopse,
            data_lancamento: film.data_lancamento,
            duracao: film.duracao,
            classificacao_etaria: film.classificacao_etaria,
            poster_path: film.poster_path,
            trailer_url: film.trailer_url,
            nota_imdb: film.nota_imdb,
            generos: generos,
        };
    });

    return {
        films: formattedFilms,
        totalCount,
    };
}

async function searchFilmsByAgeRating({ ageRating, skip = 0, take = 10 }) {
    const films = await prisma.filme.findMany({
        where: {
            classificacao_etaria: ageRating,
        },
        skip,
        take,
        include: {
            FilmeGenero: {
                select: {
                    genero: {
                        select: {
                            id_genero: true,
                            nome_genero: true,
                        },
                    },
                },
            },
        },
    });

    const totalCount = await prisma.filme.count({
        where: {
            classificacao_etaria: ageRating,
        },
    });

    const formattedFilms = films.map(film => {
        const generos = film.FilmeGenero.map(fg => ({
            id_genero: fg.genero.id_genero,
            nome_genero: fg.genero.nome_genero,
        }));

        return {
            id_filme: film.id_filme,
            id_api: film.id_api,
            titulo: film.titulo,
            slug: film.slug,
            sinopse: film.sinopse,
            data_lancamento: film.data_lancamento,
            duracao: film.duracao,
            classificacao_etaria: film.classificacao_etaria,
            poster_path: film.poster_path,
            trailer_url: film.trailer_url,
            nota_imdb: film.nota_imdb,
            generos: generos,
        };
    });

    return {
        films: formattedFilms,
        totalCount,
    };
}

async function deleteFilm(id) {
    return prisma.filme.delete({
        where: { id_filme: id },
    });
}



export {createFilm, getAllFilms, getFilmById, searchFilmsByTitle, searchFilmsByAgeRating, deleteFilm, updateFilm, searchFilmsByGenre, generateUniqueSlug}