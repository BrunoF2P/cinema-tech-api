import prisma from '../../prismaClient.js';
import axios from 'axios'

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
        data: {
            ...updateData,
            // Certifique-se de que os gêneros estão sendo atualizados corretamente
            FilmeGenero: updateData.generos ? {
                set: updateData.generos.map(id => ({ id_genero: id }))
            } : undefined,  // Apenas adiciona a atualização se os gêneros forem passados
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

    // Mapeia os gêneros para o formato desejado
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


const getGenresFromApi = async () => {
  try {
    const response = await axios.get(process.env.SERVER_URL + "/v1/genres");
    return response.data.genres;
  } catch (error) {
    console.error("Erro ao buscar gêneros:", error.message);
    throw new Error("Erro ao buscar os gêneros.");
  }
};

const mapGenresToIds = (genresList, genres) => {
  return genres
    .map((genreName) => {
      if (genreName && typeof genreName === "string") {
        const genre = genresList.find((g) => g.nome_genero === genreName);
        return genre ? genre.id_genero : null;
      } else {
        return null; 
      }
    })
    .filter((id) => id !== null);
};

async function getMovieInfoAI (movieName) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Chave da API Gemini não configurada. Verifique o arquivo .env."
    );
  }

  try {
    // Chamada para a API Gemini para buscar as informações do filme
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Forneça informações detalhadas sobre o filme "${movieName}" no formato:
                
                {
                  "titulo": "Exemplo de Filme",
                  "sinopse": "Uma breve descrição do filme.",
                  "data_lancamento": "2024-09-01",
                  "duracao": 120,
                  "classificacao_etaria": 12,
                  "nota_imdb": 8.7,
                  "generos": [
                      "Ação",
                      "Comédia"
                  ]
                }`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extraindo a resposta da IA
    const movieContent = response.data.candidates[0].content.parts[0].text;

    // Formata a resposta para um json
    const movieJsonString = movieContent.replace(/```/g, "").trim();

    // Converter a string para um objeto JSON
    const movieData = JSON.parse(movieJsonString);

    // Obter a lista de gêneros da sua API
    const genresList = await getGenresFromApi();

    // Mapear os gêneros do filme para os IDs
    const genreIds = mapGenresToIds(genresList, movieData.generos);

    // Atualizar o objeto de dados do filme com os IDs dos gêneros
    movieData.generos = genreIds;

    // Retornar o objeto modelado com os IDs dos gêneros
    return movieData;
  } catch (error) {
    console.error(
      "Erro na chamada à API Gemini:",
      error.response?.data || error.message
    );
    throw new Error("Erro ao consultar a API Gemini");
  }
};


export {
  createFilm,
  getAllFilms,
  getFilmById,
  searchFilmsByTitle,
  searchFilmsByAgeRating,
  deleteFilm,
  updateFilm,
  searchFilmsByGenre,
  generateUniqueSlug,
  getMovieInfoAI};