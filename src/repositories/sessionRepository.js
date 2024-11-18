import {findAll, findByUnique, create, update, deleteById, checkField} from "./genericRepository.js";
import prisma from "../../prismaClient.js";

async function getAllSession(){
    return await findAll('sessao', {
        filme: {
            select: {
                id_filme: true,
                slug: true,
                titulo: true,
                sinopse: true,
                data_lancamento: true,
                duracao: true,
                classificacao_etaria: true,
                poster_path: true,
                trailer_url: true,
                nota_imdb: true
            }
        },
        sala: {
            select: {
                id_tipo_sala: true,
                nome_sala: true,
                capacidade: true,
                ativo: true
            }
        },
    });
}

async function getSessionById(id) {
    const session = await findByUnique('sessao', 'id_sessao', id, {
        filme: {
            select: {
                id_filme: true,
                slug: true,
                titulo: true,
                sinopse: true,
                data_lancamento: true,
                duracao: true,
                classificacao_etaria: true,
                poster_path: true,
                trailer_url: true,
                nota_imdb: true
            }
        },
        sala: {
            select: {
                id_sala: true,
                nome_sala: true,
                capacidade: true,
                ativo: true,
                tipoSala: {
                    select: {
                        descricao: true
                    }
                }
            }
        },
        PrecoIngresso: {
            select: {
                id_preco: true,
                preco: true,
                tipo: {
                    select: {
                        descricao: true
                    }
                }
            }
        },
        reservas: {
            where: {
                status: {
                    in: ['pendente', 'confirmado']
                }
            },
            select: {
                Cadeiras: {
                    select: {
                        cadeira: {
                            select: {
                                id_cadeira: true, // Inclui o id_cadeira
                                linha: true,
                                numero: true
                            }
                        }
                    }
                }
            }
        }
    });

    // Formatação da resposta
    const cadeirasReservadas = session.reservas.flatMap(reserva =>
        reserva.Cadeiras.map(cadeira => ({
            id_cadeira: cadeira.cadeira.id_cadeira,
            linha: cadeira.cadeira.linha,
            numero: cadeira.cadeira.numero,
        }))
    );

    return {
            id: session.id_sessao,
            filme: {
                id: session.filme.id_filme,
                titulo: session.filme.titulo,
                slug: session.filme.slug,
                sinopse: session.filme.sinopse,
                data_lancamento: session.filme.data_lancamento,
                duracao: session.filme.duracao,
                classificacao_etaria: session.filme.classificacao_etaria,
                poster: session.filme.poster_path,
                trailer_url: session.filme.trailer_url,
                nota_imdb: session.filme.nota_imdb,
            },
            sala: {
                id: session.sala.id_sala,
                nome: session.sala.nome_sala,
                capacidade: session.sala.capacidade,
                ativo: session.sala.ativo,
                tipo: {
                    descricao: session.sala.tipoSala.descricao
                }
            },
            precos: session.PrecoIngresso.map(preco => ({
                id: preco.id_preco,
                valor: preco.preco,
                tipo: preco.tipo.descricao
            })),
            cadeirasReservadas,
            data_sessao: session.data_sessao // Mantenha isso caso precise da data da sessão
    };
}

async function getFilmsWithSessionsInWeek() {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() === 0 ? 6 : startOfWeek.getDay() - 1)); // Começo da semana (segunda-feira)

    // Cria a data para o domingo da mesma semana
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Fim da semana (domingo)

    const filmsWithSessions = await prisma.filme.findMany({
        where: {
            sessoes: {
                some: {
                    data_sessao: {
                        gte: startOfWeek, // Data de início da semana
                        lte: endOfWeek   // Data de fim da semana
                    }
                }
            }
        },
        include: {
            sessoes: {
                where: {
                    data_sessao: {
                        gte: startOfWeek,
                        lte: endOfWeek
                    }
                },
                select: {
                    id_sessao: true,
                    data_sessao: true,
                    sala: {
                        select: {
                            nome_sala: true
                        }
                    }
                }
            },
            FilmeGenero: {
                select: {
                    genero: {
                        select: {
                            id_genero: true,
                            nome_genero: true
                        }
                    }
                }
            }
        }
    });

    return filmsWithSessions.map(film => ({
        id: film.id_filme,
        titulo: film.titulo,
        slug: film.slug,
        sinopse: film.sinopse,
        data_lancamento: film.data_lancamento,
        duracao: film.duracao,
        classificacao_etaria: film.classificacao_etaria,
        poster: film.poster_path,
        trailer_url: film.trailer_url,
        nota_imdb: film.nota_imdb,
        generos: film.FilmeGenero.map(fg => ({
            id_genero: fg.genero.id_genero,
            nome_genero: fg.genero.nome_genero
        })),
        sessoes: film.sessoes.map(sessao => ({
            id_sessao: sessao.id_sessao,
            data_sessao: sessao.data_sessao,
            sala: sessao.sala.nome_sala
        }))
    }));
}



async function getSessionByMovieId(id) {
    const now = new Date(); // Data atual para comparar

    // Buscar as sessões do filme com ID especificado e filtrar as futuras
    const sessions = await prisma.filme.findUnique({
        where: { id_filme: id },
        include: {
            sessoes: {
                where: {
                    data_sessao: {
                        gte: now // Filtra as sessões que ainda vão ocorrer
                    }
                },
                select: {
                    id_sessao: true,
                    data_sessao: true,
                    sala: {
                        select: {
                            nome_sala: true
                        }
                    }
                }
            },
            FilmeGenero: {
                select: {
                    genero: {
                        select: {
                            id_genero: true,
                            nome_genero: true
                        }
                    }
                }
            } // Incluindo os gêneros do filme
        }
    });

    // Retornar as informações do filme com suas sessões futuras e gêneros
    return {
        id: sessions.id_filme,
        titulo: sessions.titulo,
        slug: sessions.slug,
        sinopse: sessions.sinopse,
        data_lancamento: sessions.data_lancamento,
        duracao: sessions.duracao,
        classificacao_etaria: sessions.classificacao_etaria,
        poster: sessions.poster_path,
        trailer_url: sessions.trailer_url,
        nota_imdb: sessions.nota_imdb,
        generos: sessions.FilmeGenero.map(fg => ({
            id_genero: fg.genero.id_genero,
            nome_genero: fg.genero.nome_genero
        })),
        sessoes: sessions.sessoes.map(sessao => ({
            id_sessao: sessao.id_sessao,
            data_sessao: sessao.data_sessao,
            sala: sessao.sala.nome_sala
        }))
    };
}


async function getFilmsComingThisMonth() {
    const currentDate = new Date();
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Último dia do mês

    const filmsComingThisMonth = await prisma.filme.findMany({
        where: {
            data_lancamento: {
                gte: currentDate, // Filmes com lançamento futuro
                lte: endOfMonth // E até o fim do mês
            }
        },
        include: {
            FilmeGenero: {
                select: {
                    genero: {
                        select: {
                            id_genero: true,
                            nome_genero: true
                        }
                    }
                }
            },
            sessoes: {
                where: {
                    data_sessao: {
                        gte: currentDate // Apenas sessões futuras
                    }
                },
                select: {
                    id_sessao: true,
                    data_sessao: true,
                    sala: {
                        select: {
                            nome_sala: true
                        }
                    }
                }
            }
        }
    });

    return filmsComingThisMonth.map(film => ({
        id: film.id_filme,
        titulo: film.titulo,
        slug: film.slug,
        sinopse: film.sinopse,
        data_lancamento: film.data_lancamento,
        duracao: film.duracao,
        classificacao_etaria: film.classificacao_etaria,
        poster: film.poster_path,
        trailer_url: film.trailer_url,
        nota_imdb: film.nota_imdb,
        generos: film.FilmeGenero.map(fg => ({
            id_genero: fg.genero.id_genero,
            nome_genero: fg.genero.nome_genero
        })),
        sessoes: film.sessoes.map(sessao => ({
            id_sessao: sessao.id_sessao,
            data_sessao: sessao.data_sessao,
            sala: sessao.sala.nome_sala
        }))
    }));
}

async function getFilmsWithFutureSessions() {
    const currentDate = new Date();
    const thirtyDaysLater = new Date(currentDate);
    thirtyDaysLater.setDate(currentDate.getDate() + 30); // Data de 30 dias a partir de hoje

    const filmsWithFutureSessions = await prisma.filme.findMany({
        where: {
            sessoes: {
                some: {
                    data_sessao: {
                        gte: currentDate, // Sessões a partir de hoje
                        lte: thirtyDaysLater // E até 30 dias a partir de hoje
                    }
                }
            }
        },
        include: {
            FilmeGenero: {
                select: {
                    genero: {
                        select: {
                            id_genero: true,
                            nome_genero: true
                        }
                    }
                }
            },
            sessoes: {
                where: {
                    data_sessao: {
                        gte: currentDate, // Sessões a partir de hoje
                        lte: thirtyDaysLater // E até 30 dias a partir de hoje
                    }
                },
                select: {
                    id_sessao: true,
                    data_sessao: true,
                    sala: {
                        select: {
                            nome_sala: true
                        }
                    }
                }
            }
        }
    });

    return filmsWithFutureSessions.map(film => ({
        id: film.id_filme,
        titulo: film.titulo,
        slug: film.slug,
        sinopse: film.sinopse,
        data_lancamento: film.data_lancamento,
        duracao: film.duracao,
        classificacao_etaria: film.classificacao_etaria,
        poster: film.poster_path,
        trailer_url: film.trailer_url,
        nota_imdb: film.nota_imdb,
        generos: film.FilmeGenero.map(fg => ({
            id_genero: fg.genero.id_genero,
            nome_genero: fg.genero.nome_genero
        })),
        sessoes: film.sessoes.map(sessao => ({
            id_sessao: sessao.id_sessao,
            data_sessao: sessao.data_sessao,
            sala: sessao.sala.nome_sala
        }))
    }));
}



async function getSessionsByDateRange(startDate, endDate) {
    return await checkField('sessao',{
        data_sessao: {
            gte: new Date(startDate),
            lte: new Date(endDate)
        },
    });
}

async function checkSessionConflict(idSala, dataSessao) {
    return await checkField('sessao',{
        id_sala: idSala,
        data_sessao: {
            equals: dataSessao,
        },
    });
}
async function createSession(sessionData){
    return await create('sessao', sessionData);
}

async function updateSession(id, sessionData){
    return await update('sessao', 'id_sessao', id, sessionData)
}

async function deleteSession(id){
    return await deleteById('sessao', 'id_sessao', id);
}

export {getAllSession,
    getSessionById,
    getSessionByMovieId,
    getSessionsByDateRange,
    getFilmsComingThisMonth,
    checkSessionConflict,
    createSession,
    updateSession,
    deleteSession,
    getFilmsWithSessionsInWeek,
    getFilmsWithFutureSessions,
}