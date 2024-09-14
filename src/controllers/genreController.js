import {validationResult} from "express-validator";
import {
    getAllGenres,
    getGenreById,
    createGenre,
    updateGenre,
    deleteGenre,
    getGenreByName
} from '../repositories/genreRepository.js';


const genreController = {

    async createGenreController(req, res) {
        const { nome_genero } = req.body;

        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }


        try {

            const existingGenre = await getGenreByName(nome_genero);
            if (existingGenre) {
                return res.status(400).json({ success: false, msg: 'Gênero já existe.' });
            }

            const newGenre = await createGenre({nome_genero});
            res.json({
                success: true,
                msg: 'Gênero criado com sucesso',
                genre: newGenre,
            });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao criar o gênero' });
        }
    },

    async getAllGenresController(req, res) {

        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }

        try {
            const genres = await getAllGenres();
            res.json({
                success: true,
                msg: 'Gêneros encontrados com sucesso',
                genres,
            });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao buscar os gêneros' });
        }
    },

    async getGenreByIdController(req, res) {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }
        const { id } = req.params;

        try {
            const genre = await getGenreById(parseInt(id));
            if (!genre) return res.status(404).json({ success: false, msg: 'Gênero não encontrado' });

            res.json({
                success: true,
                msg: 'Gênero encontrado com sucesso',
                genre,
            });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao buscar o gênero' });
        }
    },

    async updateGenreController(req, res) {
        const { id } = req.params;
        const { nome_genero } = req.body;

        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }

        const genre = await getGenreById(parseInt(id));

        if (!genre) {
            return res.status(404).json({success: false, msg: 'Gênero não encontrado'
            });}

        try {
            const updatedGenre = await updateGenre(parseInt(id, 10), {
                ...(nome_genero && { nome_genero }),
            });

            res.json({
                success: true,
                msg: 'Gênero atualizado com sucesso',
                genre: updatedGenre,
            });

        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, msg: 'Falha ao atualizar o gênero' });
        }
    },

    async deleteGenreController(req, res) {

        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }

        const { id } = req.params;

        const genre = await getGenreById(parseInt(id));

        if (!genre) {
            return res.status(404).json({success: false, msg: 'Gênero não encontrado'
            });}

        try {
            await deleteGenre(parseInt(id));
            res.json({
                success: true,
                msg: 'Gênero deletado com sucesso',
            });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao deletar o gênero' });
        }
    }
};

export default genreController;