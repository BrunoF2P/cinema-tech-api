import {

    getChairById,
    getChairsByRoomId,
    updateChair
} from '../repositories/chairRepository.js';
import {addChairToRoom, removeChairFromRoom} from "../repositories/roomRepository.js";
import prisma from "../../prismaClient.js";
import {validationResult} from "express-validator";

const chairController = {
    async addChairController(req, res) {
        const { id_sala } = req.params;
        const chairs = req.body;
        try {

            if (!id_sala) {
                return res.status(400).json({ success: false, msg: 'ID da sala não fornecido.' });
            }

            const roomExists = await prisma.sala.findUnique({
                where: { id_sala: parseInt(id_sala) },
            });

            if (!roomExists) {
                return res.status(404).json({ success: false, msg: 'Sala não encontrada.' });
            }

            const existingChairs = await Promise.all(chairs.map(async (chair) => {
                const { linha, numero } = chair;

                const existingChair = await prisma.cadeira.findFirst({
                    where: { id_sala: parseInt(id_sala), linha, numero },
                });

                if (existingChair) {
                    return { success: false, msg: `A cadeira ${linha}-${numero} já está cadastrada.` };
                }

                return null;
            }));

            const errors = existingChairs.filter(result => result !== null);
            if (errors.length > 0) {
                return res.status(400).json({ success: false, errors });
            }

            const results = await Promise.all(chairs.map(async (chair) => {
                const { linha, numero } = chair;
                return await addChairToRoom(parseInt(id_sala), linha, numero);
            }));

            res.json({
                success: true,
                msg: 'Cadeiras processadas com sucesso',
                results,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Falha ao adicionar cadeiras' });
        }
    },


    async removeChairController(req, res) {
        const { id_cadeira } = req.params;

        try {
            const updatedRoom = await removeChairFromRoom(parseInt(id_cadeira));
            res.json({
                success: true,
                msg: 'Cadeira removida com sucesso',
                updatedRoom,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Falha ao remover cadeira' });
        }
    },

    async getChairController(req, res) {
        const { id_cadeira } = req.params;

        try {
            const chair = await getChairById(parseInt(id_cadeira));
            if (!chair) {
                return res.status(404).json({ success: false, msg: 'Cadeira não encontrada' });
            }
            res.json({ success: true, chair });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Erro ao buscar cadeira' });
        }
    },

    async getChairsByRoomController(req, res) {
        const { id_sala } = req.params;

        try {
            const chairs = await getChairsByRoomId(parseInt(id_sala));

            // Verifica se a sala não possui cadeiras
            if (!chairs || chairs.length === 0) {
                return res.status(400).json({ success: false, msg: 'Não há cadeiras cadastradas para esta sala.' });
            }

            res.json({ success: true, chairs });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Erro ao buscar cadeiras da sala' });
        }
    },

    async getChairByRoomAndId(req, res) {
        const { id_sala, id_cadeira } = req.params;

        try {
            const chair = await prisma.cadeira.findFirst({
                where: {
                    id_sala: parseInt(id_sala, 10),
                    id_cadeira: parseInt(id_cadeira, 10),
                },
            });

            if (!chair) {
                return res.status(404).json({ success: false, msg: 'Cadeira não encontrada para esta sala.' });
            }

            res.json({
                success: true,
                chair,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Erro ao buscar cadeira.' });
        }
    },

    async updateChairController(req, res) {
        const { id_cadeira } = req.params;
        const { ativo } = req.body;

        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }

        const chairExist = await getChairById(parseInt(id_cadeira));

        if (!chairExist) {
            return res.status(404).json({ success: false, msg: 'Cadeira não encontrada' });
        }

        try {
            const updatedChair = await updateChair(parseInt(id_cadeira), {
                ...(ativo !== undefined && { ativo })
            });
            res.json({
                success: true,
                msg: 'Cadeira atualizada com sucesso',
                updatedChair,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Falha ao atualizar cadeira' });
        }
    },
};

export default chairController;
