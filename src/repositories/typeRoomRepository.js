import {findAll, findByUnique, create, findByField, update, deleteById} from './genericRepository.js';

async function getAllTypeRooms() {
    return findAll('tipoSala');
}

async function getTypeRoomById(id) {
    return findByUnique('tipoSala', 'id_tipo_sala', id);
}

async function createTypeRoom(typeRoomData) {
    return create('tipoSala', typeRoomData);
}

async function getTypeRoomByDescription(descricao) {
    return await findByUnique('tipoSala', 'descricao', descricao);
}

async function updateTypeRoom(id, typeRoomData){
    return update('tipoSala', 'id_tipo_sala', id,typeRoomData)
}

async function deleteTypeRoom(id){
    return deleteById('tipoSala', 'id_tipo_sala', id)
}


export {getTypeRoomById, getAllTypeRooms, createTypeRoom, getTypeRoomByDescription, updateTypeRoom, deleteTypeRoom};
