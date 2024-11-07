import { validationResult } from "express-validator";
import {
    getAllStates,
    getStateById,
    createState,
    updateState,
    deleteState,
    getStateByName
} from '../repositories/stateRepository.js';

const stateController = {

    async createStateController(req, res) {
        const { nome_estado, sigla_estado } = req.body;

        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ error: validation.array() });
        }

        try {
            const existingState = await getStateByName(nome_estado);
            if (existingState) {
                return res.status(400).json({ success: false, msg: 'Estado já existe' });
            }

            const newState = await createState({ nome_estado, sigla_estado });
            res.status(201).json({
                success: true,
                msg: 'Estado criado com sucesso',
                state: newState,
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, msg: 'Falha ao criar o estado' });
        }
    },

    async getAllStatesController(req, res) {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ error: validation.array() });
        }

        try {
            const states = await getAllStates();
            res.json({
                success: true,
                msg: 'Estados encontrados com sucesso',
                states,
            });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao econtrar estados' });
        }
    },

    async getStateByIdController(req, res) {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ error: validation.array() });
        }
        const { id } = req.params;

        try {
            const state = await getStateById(parseInt(id));
            if (!state) return res.status(404).json({ success: false, msg: 'Estado não encontrado' });

            res.json({
                success: true,
                msg: 'Estado encontrado com sucesso',
                state,
            });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao encontrar estado' });
        }
    },
    async updateStateController(req, res) {
        const { id } = req.params;
        const { nome_estado, sigla_estado } = req.body;

        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ error: validation.array() });
        }

        const state = await getStateById(parseInt(id, 10));

        if (!state) {
            return res.status(404).json({ success: false, msg: 'Estado não encontrado' });
        }

        if (nome_estado) {
            const existingState = await getStateByName(nome_estado);
            if (existingState) {
                return res.status(400).json({ success: false, msg: 'Estado já existe' });
            }
        }

        try {

            const updatedState = await updateState(parseInt(id, 10), {
                ...(nome_estado && { nome_estado }),
                ...(sigla_estado && { sigla_estado }),
            });

            res.json({
                success: true,
                msg: 'Estado atualizado com sucesso',
                state: updatedState,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Falha ao atualizar o estado' });
        }
    },

    async deleteStateController(req, res) {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ error: validation.array() });
        }

        const { id } = req.params;

        const state = await getStateById(parseInt(id));

        if (!state) {
            return res.status(404).json({ success: false, msg: 'Estado não encontrado' });
        }

        try {
            await deleteState(parseInt(id));
            res.json({
                success: true,
                msg: 'Estado deletado com sucesso',
            });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao deletar o estado' });
        }
    }
};

export default stateController;
