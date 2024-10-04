import {findAll, findByUnique, create, update, deleteById, findByField, checkField} from "./genericRepository.js";

async function getAllSession(){
    return await findAll('sessao', {
        filme: {
            select: {
                id_filme: true,
                titulo: true,
                sinopse: true,
                data_lancamento: true,
                duracao: true,
                classificacao_etaria: true,
                poster_path: true,
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
                titulo: true,
                sinopse: true,
                data_lancamento: true,
                duracao: true,
                classificacao_etaria: true,
                poster_path: true,
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
                sinopse: session.filme.sinopse,
                data_lancamento: session.filme.data_lancamento,
                duracao: session.filme.duracao,
                classificacao_etaria: session.filme.classificacao_etaria,
                poster: session.filme.poster_path,
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



async function getSessionByMovieId(id) {
    return await findByField('sessao', 'id_filme', id,{
        filme: true,
        sala: true,
    });
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

export {getAllSession, getSessionById, getSessionByMovieId, getSessionsByDateRange, checkSessionConflict, createSession, updateSession, deleteSession}