import { findAll, findByUnique, create, findByField, update, deleteById } from './genericRepository.js';

async function getAllStates() {
    return findAll('estado');
}

async function getStateById(id) {
    return findByUnique('estado', 'id_estado', id);
}

async function createState(stateData) {
    return create('estado', stateData);
}

async function getStateByName(name) {
    return findByUnique('estado', 'nome_estado', name);
}

async function updateState(id, stateData) {
    return update('estado', 'id_estado', id, stateData);
}

async function deleteState(id) {
    return deleteById('estado', 'id_estado', id);
}

export { getAllStates, getStateById, createState, updateState, deleteState, getStateByName };
