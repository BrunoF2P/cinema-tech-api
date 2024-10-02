import {findAll, findByUnique, create, update, deleteById, findByField, checkField} from "./genericRepository.js";

async function getAllSession(){
    return await findAll('sessao', {
        filme: true,
        sala: true,
    });
}

async function getSessionById(id){
    return await findByUnique('sessao', 'id_sessao', id,{
        filme: true,
        sala: true,
    });
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