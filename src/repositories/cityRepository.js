import {findAll, findByUnique, create, update, deleteById, findByField} from './genericRepository.js';

async function getAllCities() {
    return findAll('cidade');
}

async function getCityById(id) {
    return findByUnique('cidade', 'id_cidade', id, { estado: true });
}

async function createCity(cityData) {
    return create('cidade', cityData);
}

async function updateCity(id, cityData) {
    return update('cidade', 'id_cidade', id, cityData);
}

async function deleteCity(id) {
    return deleteById('cidade', 'id_cidade', id);
}

async function getCitiesByStateId(stateId) {
    return findByField('cidade', 'id_estado', stateId
    );
}

export { getAllCities, getCityById, createCity, updateCity, deleteCity, getCitiesByStateId };
