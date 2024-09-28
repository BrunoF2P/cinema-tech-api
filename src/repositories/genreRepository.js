import { findAll, findByUnique, create, findByField, update, deleteById } from './genericRepository.js';

async function getAllGenres() {
    return findAll('genero');
}

async function getGenreById(id) {
    return findByUnique('genero', 'id_genero', id);
}

async function createGenre(genreData) {
    return create('genero', genreData);
}

async function getGenreByName(name) {
    return findByUnique('genero', 'nome_genero', name);
}

async function updateGenre(id, genreData) {
    return update('genero', 'id_genero', id, genreData);
}

async function deleteGenre(id) {
    return deleteById('genero', 'id_genero', id);
}

export { getAllGenres, getGenreById, createGenre, updateGenre, deleteGenre, getGenreByName };
