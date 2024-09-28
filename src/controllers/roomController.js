import {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
    addChairToRoom, getRoomByName,
} from '../repositories/roomRepository.js';
import { validationResult } from "express-validator";

const roomController = {
    async getAllRoomsController(req, res) {
        try {
            const rooms = await getAllRooms();
            res.json({ success: true,
                msg: 'Pesquisa solicitada com sucesso',
                rooms });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Falha ao obter as salas' });
        }
    },

    async getRoomByIdController(req, res) {
        const { id } = req.params;

        try {
            const room = await getRoomById(parseInt(id));
            if (!room) return res.status(404).json({ success: false, msg: 'Sala não encontrada' });

            res.json({ success: true,
                msg: 'Pesquisa solicitada com sucesso',
                room });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Falha ao obter a sala' });
        }
    },

    async createRoomController(req, res) {
        const { nome_sala, tipoSala } = req.body;

        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }

        try {

            const existingItem = await getRoomByName(nome_sala);
            if (existingItem) {
                return res.status(400).json({ success: false, msg: `${nome_sala} já existe.`});
            }

            const newRoom = await createRoom({
                nome_sala,
                tipoSala: { connect: { id_tipo_sala: tipoSala } }
            });

            res.status(201).json({
                success: true,
                msg: 'Sala criada com sucesso',
                newRoom,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Falha ao criar a sala' });
        }
    },

    async updateRoomController(req, res) {
        const { id } = req.params;
        const { nome_sala, tipoSala } = req.body;

        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }

        const roomExist = await getRoomById(parseInt(id));

        if (!roomExist) {
            return res.status(404).json({ success: false, msg: 'Sala não encontrada' });
        }

        if (nome_sala) {
            const roomWithSameName = await getRoomByName(nome_sala);

            if (roomWithSameName && roomWithSameName.id_sala !== id) {
                return res.status(400).json({ success: false, msg: 'Nome da sala já está em uso por outra sala' });
            }
        }

        try {
            const updatedRoom = await updateRoom(parseInt(id, 10), {
                ...(nome_sala && { nome_sala }),
                ...(tipoSala && { tipoSala: { connect: { id_tipo_sala: tipoSala } } })
            });

            res.json({
                success: true,
                msg: 'Sala atualizada com sucesso',
                room: updatedRoom,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Falha ao atualizar a sala' });
        }
    },

    async deleteRoomController(req, res) {
        const { id } = req.params;

        try {
            const deletedRoom = await deleteRoom(parseInt(id));
            if (!deletedRoom) return res.status(404).json({ success: false, msg: 'Sala não encontrada' });

            res.json({
                success: true,
                msg: 'Sala deletada com sucesso',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Falha ao deletar a sala' });
        }
    },

    async addChairController(req, res) {
        const { id } = req.params;
        const { chairData } = req.body;

        try {
            const room = await getRoomById(parseInt(id));
            if (!room) return res.status(404).json({ success: false, msg: 'Sala não encontrada' });

            const updatedRoom = await addChairToRoom(parseInt(id), chairData);

            res.json({
                success: true,
                msg: 'Cadeira adicionada com sucesso',
                item: updatedRoom,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Falha ao adicionar a cadeira' });
        }
    },
};

export default roomController;
