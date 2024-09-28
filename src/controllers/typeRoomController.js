import {
    getAllTypeRooms,
    createTypeRoom,
    updateTypeRoom,
    deleteTypeRoom,
    getTypeRoomById,
    getTypeRoomByDescription
} from '../repositories/typeRoomRepository.js';
import { validationResult } from 'express-validator';

const typeRoomController = {

    async createTypeRoomController(req, res) {
        const { descricao } = req.body;

        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }

        try {
            const existingItem = await getTypeRoomByDescription(descricao);
            if (existingItem) {
                return res.status(400).json({ success: false, msg: `${descricao} já existe.`});
            }
            
            const typeRoomData = await createTypeRoom({ descricao });

            res.json({ success: true, msg: 'Tipo de sala cadastrado com sucesso', typeRoomData });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao cadastrar o tipo de sala' });
        }
    },

    async getAllTypeRoomsController(req, res) {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }

        try {
            const typeRooms = await getAllTypeRooms();

            res.json({ success: true, msg: 'Pesquisa solicitada com sucesso', typeRooms });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao buscar os tipos de sala' });
        }
    },

    async getTypeRoomByIdController(req, res) {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }
        const { id } = req.params;

        try {
            const typeRoomData = await getTypeRoomById(parseInt(id));

            if (!typeRoomData) return res.status(404).json({ success: false, msg: 'Tipo de sala não encontrado' });

            res.json({ success: true, msg: 'Tipo de sala encontrado com sucesso', typeRoomData });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao buscar o tipo de sala' });
        }
    },

    async updateTypeRoomController(req, res) {
        const { id } = req.params;
        const { descricao } = req.body;

        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }

        if (descricao) {
            const typeRoomWithSameDescription = await getTypeRoomByDescription(descricao);

            if (typeRoomWithSameDescription && typeRoomWithSameDescription.id_tipo_sala !== id) {
                return res.status(400).json({ success: false, msg: 'Descrição já está em uso por outro tipo de sala' });
            }
        }

        try {
            const typeRoomData = await getTypeRoomById(parseInt(id));

            if (!typeRoomData) {
                return res.status(404).json({ success: false, msg: 'Tipo de sala não encontrado' });
            }

            const updatedTypeRoom = await updateTypeRoom(parseInt(id), { descricao });

            res.json({
                success: true,
                msg: 'Tipo de sala atualizado com sucesso',
                typeRoom: updatedTypeRoom,
            });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao atualizar o tipo de sala' });
        }
    },

    async deleteTypeRoomController(req, res) {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }

        const { id } = req.params;
        const typeRoom = await getTypeRoomById(parseInt(id));

        if (!typeRoom) {
            return res.status(404).json({ success: false, msg: 'Tipo de sala não encontrado' });
        }

        try {
            await deleteTypeRoom(parseInt(id));
            res.json({ success: true, msg: 'Tipo de sala deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao deletar o tipo de sala' });
        }
    },
}

export default typeRoomController;
