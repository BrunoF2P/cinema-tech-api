import {
    createFilm, deleteFilm,
    getAllFilms,
    getFilmById,
    searchFilmsByAgeRating,
    searchFilmsByTitle, updateFilm
} from '../repositories/filmRepository.js';
import {validationResult} from 'express-validator';

const filmController = {
    // Criar um filme
    async  createFilmController (req, res) {
        const { titulo, sinopse, data_lancamento, duracao, classificacao_etaria, poster_path, backdrop_path, nota_imdb, generos } = req.body;

        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }

        try {
            const filmeData = await createFilm({
                data: {
                    titulo,
                    sinopse,
                    data_lancamento,
                    duracao,
                    classificacao_etaria,
                    poster_path,
                    backdrop_path,
                    nota_imdb,
                    generos: {
                        connect: generos.map(id => ({ id_genero: id }))
                    }
                }
            });

            res.json({ success: true, msg: 'Filme cadastrado com sucesso', filmeData});

        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao cadastrar o filme' });
        }
    },

    // Buscar todos os filmes
    async  getAllFilmsController (req, res ){
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }

        try {
            // Obtém parâmetros de paginação da requisição
            const page = parseInt(req.query.page) || 1;  // Página padrão é 1
            const limit = parseInt(req.query.limit) || 10; // Limite padrão é 10

            // Valida os parâmetros
            if (page < 1 || limit < 1) {
                return res.status(400).json({ erro: 'Parâmetros de paginação inválidos' });
            }

            // Calcula o offset para a consulta
            const offset = (page - 1) * limit;

            const { films, totalCount } = await getAllFilms({ skip: offset, take: limit });

            res.json({
                success: true,
                msg: 'Pesquisa solicitada com sucesso',
                films,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
            });

        }catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao buscar os filmes' });
        }
    },

    // Buscar filmes por id
    async  getFilmByIdController (req, res ){
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }
        const {id} = req.params;

        try {

            const filmData = await getFilmById(parseInt(id));

            if (!filmData) return res.status(404).json({ success: false, msg: 'Filme não encontrado' })


            res.json({
                success: true,
                msg: 'Filme encontrado com sucesso',
                filmData: {
                    id: filmData.id_filme,
                    titulo: filmData.titulo,
                    slug: filmData.slug,
                    sinopse: filmData.sinopse,
                    data_lancamento: filmData.data_lancamento,
                    duracao: filmData.duracao,
                    classificacao_etaria: filmData.classificacao_etaria,
                    poster_path: filmData.poster_path,
                    backdrop_path: filmData.backdrop_path,
                    nota_imdb: filmData.nota_imdb
                }
            });

        }catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao buscar os filmes' });
        }
    },


    // Buscar filmes por título
    async  searchFilmsByTitleController (req, res) {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }

        const title = req.query.title;

        if (!title || title.trim() === '') {
            return res.status(400).json({ success: false, msg: 'O campo título é obrigatório e não pode ser nulo ou vazio.' });
        }

        try {
            const films = await searchFilmsByTitle(title);

            if (films.length === 0) {
                return res.status(404).json({ success: false, msg: 'Nenhum filme encontrado com o título fornecido.' });
            }

            res.json({
                success: true,
                msg: 'Pesquisa solicitada com sucesso',
                films,
            });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao buscar filmes por título' });
        }
    },

    // Busca filmes por faixa etaria
    async  searchFilmsByAgeRatingController (req, res ){
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }
        const ageRating = parseInt(req.query.ageRating);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        try {
            const filmData = await searchFilmsByAgeRating({
                where: { classificacao_etaria: parseInt(ageRating)}
            });



            if (page < 1 || limit < 1 || isNaN(ageRating)) {
                return res.status(400).json({ erro: 'Nenhum filme encontrado' });
            }

            const offset = (page - 1) * limit;

            const { films, totalCount } = await searchFilmsByAgeRating({ ageRating, skip: offset, take: limit });

            res.json({
                success: true,
                msg: 'Pesquisa solicitada com sucesso',
                films,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
            });

        }catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao buscar os filmes' });
        }
    },

    async  updateFilmController(req, res) {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }

        const { id } = req.params;
        const filmData = req.body;

        try {
            const updatedFilm = await updateFilm(id, filmData);
            res.json({
                success: true,
                msg: 'Filme atualizado com sucesso',
                film: updatedFilm,
            });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao atualizar o filme' });
        }
    },

    // Função para deletar um filme
    async deleteFilmController(req, res) {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }

        const { id } = req.params;

        try {
            await deleteFilm(id);
            res.json({
                success: true,
                msg: 'Filme deletado com sucesso',
            });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao deletar o filme' });
        }
    }
}

export default filmController;