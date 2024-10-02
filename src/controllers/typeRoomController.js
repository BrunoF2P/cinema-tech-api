import {
    createTypeRoom,
    deleteTypeRoom,
    getAllTypeRooms,
    getTypeRoomByDescription,
    getTypeRoomById,
    updateTypeRoom
} from '../repositories/typeRoomRepository.js';

const typeRoomController = {

    async createTypeRoomController(req, res) {
        const {descricao} = req.body;

        try {
            const typeRoomData = await createTypeRoom({descricao});

            res.json({success: true, msg: 'Tipo de sala cadastrado com sucesso', typeRoomData});
        } catch (error) {
            res.status(500).json({success: false, msg: 'Falha ao cadastrar o tipo de sala'});
        }
    },

    async getAllTypeRoomsController(req, res) {
        try {
            const typeRooms = await getAllTypeRooms();

            res.json({success: true, msg: 'Pesquisa solicitada com sucesso', typeRooms});
        } catch (error) {
            res.status(500).json({success: false, msg: 'Falha ao buscar os tipos de sala'});
        }
    },

    async getTypeRoomByIdController(req, res) {
        const {id_tipo_sala} = req.params;

        try {
            const typeRoomData = await getTypeRoomById(parseInt(id_tipo_sala));

            if (!typeRoomData) return res.status(404).json({success: false, msg: 'Tipo de sala não encontrado'});

            res.json({success: true, msg: 'Tipo de sala encontrado com sucesso', typeRoomData});
        } catch (error) {
            res.status(500).json({success: false, msg: 'Falha ao buscar o tipo de sala'});
        }
    },

    async updateTypeRoomController(req, res) {
        const {id_tipo_sala} = req.params;
        const {descricao} = req.body;

        if (descricao) {
            const typeRoomWithSameDescription = await getTypeRoomByDescription(descricao);

            if (typeRoomWithSameDescription && typeRoomWithSameDescription.id_tipo_sala !== id_tipo_sala) {
                return res.status(400).json({success: false, msg: 'Descrição já está em uso por outro tipo de sala'});
            }
        }

        try {
            const typeRoomData = await getTypeRoomById(parseInt(id_tipo_sala));

            if (!typeRoomData) {
                return res.status(404).json({success: false, msg: 'Tipo de sala não encontrado'});
            }

            const updatedTypeRoom = await updateTypeRoom(parseInt(id_tipo_sala), {descricao});

            res.json({
                success: true,
                msg: 'Tipo de sala atualizado com sucesso',
                typeRoom: updatedTypeRoom,
            });
        } catch (error) {
            res.status(500).json({success: false, msg: 'Falha ao atualizar o tipo de sala'});
        }
    },

    async deleteTypeRoomController(req, res) {
        const {id_tipo_sala} = req.params;
        const typeRoom = await getTypeRoomById(parseInt(id_tipo_sala));

        if (!typeRoom) {
            return res.status(404).json({success: false, msg: 'Tipo de sala não encontrado'});
        }

        try {
            await deleteTypeRoom(parseInt(id_tipo_sala));
            res.json({success: true, msg: 'Tipo de sala deletado com sucesso'});
        } catch (error) {
            res.status(500).json({success: false, msg: 'Falha ao deletar o tipo de sala'});
        }
    },
}

export default typeRoomController;
