import { validationResult } from "express-validator";
import {
    getAllCities,
    getCityById,
    createCity,
    updateCity,
    deleteCity,
    getCitiesByStateId
} from '../repositories/cityRepository.js';

const cityController = {

    async createCityController(req, res) {
        const { nome_cidade, id_estado } = req.body;

        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ error: validation.array() });
        }

        try {
            const newCity = await createCity({ nome_cidade, id_estado });
            res.status(201).json({
                success: true,
                msg: 'Cidade criada com sucesso',
                city: newCity,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Falha ao criar a cidade' });
        }
    },

    async getAllCitiesController(req, res) {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ error: validation.array() });
        }

        try {
            const cities = await getAllCities();
            res.json({
                success: true,
                msg: 'Cidades encontradas com sucesso',
                cities,
            });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao encontrar cidades' });
        }
    },

    async getCityByIdController(req, res) {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ error: validation.array() });
        }
        const { id } = req.params;

        try {
            const city = await getCityById(parseInt(id));
            if (!city) return res.status(404).json({ success: false, msg: 'Cidade não encontrada' });

            res.json({
                success: true,
                msg: 'Cidade encontrada com sucesso',
                city,
            });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao encontrar cidade' });
        }
    },

    async updateCityController(req, res) {
        const { id } = req.params;
        const { nome_cidade, id_estado } = req.body;

        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ error: validation.array() });
        }

        const city = await getCityById(parseInt(id, 10));

        if (!city) {
            return res.status(404).json({ success: false, msg: 'Cidade não encontrada' });
        }

        try {
            const updatedCity = await updateCity(parseInt(id, 10), {
                ...(nome_cidade && { nome_cidade }),
                ...(id_estado && { id_estado }),
            });

            res.json({
                success: true,
                msg: 'Cidade atualizada com sucesso',
                city: updatedCity,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Falha ao atualizar a cidade' });
        }
    },

    async deleteCityController(req, res) {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ error: validation.array() });
        }

        const { id } = req.params;

        const city = await getCityById(parseInt(id));

        if (!city) {
            return res.status(404).json({ success: false, msg: 'Cidade não encontrada' });
        }

        try {
            await deleteCity(parseInt(id));
            res.json({
                success: true,
                msg: 'Cidade deletada com sucesso',
            });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao deletar a cidade' });
        }
    },

    async getCitiesByStateController(req, res) {
        const { id } = req.params;

        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ error: validation.array() });
        }

        try {
            const cities = await getCitiesByStateId(parseInt(id));
            res.json({
                success: true,
                msg: 'Cidades encontradas com sucesso',
                cities,
            });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao encontrar cidades' });
        }
    }
};

export default cityController;
