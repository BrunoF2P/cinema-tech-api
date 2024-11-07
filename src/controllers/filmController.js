import {
    createFilm, deleteFilm, generateUniqueSlug,
    getAllFilms,
    getFilmById,
    searchFilmsByAgeRating, searchFilmsByGenre,
    searchFilmsByTitle, updateFilm
} from '../repositories/filmRepository.js';
import {validationResult} from 'express-validator';

const filmController = {
    // Criar um filme
    async  createFilmController (req, res) {
        const { titulo, sinopse, data_lancamento, duracao, classificacao_etaria, poster_path, trailer_url, nota_imdb, generos } = req.body;

        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }

        try {
            const formattedDate = new Date(data_lancamento).toISOString();

            const filmData = await createFilm({
                data: {
                    titulo,
                    sinopse,
                    data_lancamento: formattedDate,
                    duracao,
                    classificacao_etaria,
                    poster_path,
                    trailer_url,
                    nota_imdb,
                    slug: await generateUniqueSlug(titulo),
                    generos: {
                        connect: generos.map(id => ({ id_genero: id }))
                    }
                }

            });

            res.status(201).json({ success: true, msg: 'Filme cadastrado com sucesso', filmData});

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


            res.json({success: true, msg: 'Filme encontrado com sucesso', filmData});

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
            console.log(error)
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

        if (isNaN(ageRating) || ageRating < 1) {
            return res.status(400).json({ erro: 'Faixa etária inválida' });
        }

        if (page < 1 || limit < 1) {
            return res.status(400).json({ erro: 'Parâmetros de paginação inválidos' });
        }

        try {
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

        const idExist = await getFilmById(parseInt(id));

        if (!idExist) {
            return res.status(404).json({success: false, msg: 'Filme não encontrado'
            });}

        const { titulo, sinopse, data_lancamento, duracao, classificacao_etaria, poster_path, trailer_url, nota_imdb, generos } = req.body;

        let formattedDate = null;

        if (data_lancamento) {

            const parsedDate = new Date(data_lancamento);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({ error: 'Formato de data invalido' });
            }
            formattedDate = parsedDate.toISOString();
        }


        try {
            const updatedFilm = await updateFilm(parseInt(id, 10), {
                ...(titulo && { titulo }),
                ...(sinopse && { sinopse }),
                ...(formattedDate && { data_lancamento: formattedDate }),
                ...(duracao && { duracao }),
                ...(classificacao_etaria && { classificacao_etaria }),
                ...(poster_path && { poster_path }),
                ...(trailer_url && { trailer_url }),
                ...(nota_imdb && { nota_imdb }),
                ...(generos && {
                    generos: {
                        set: generos.map(id => ({ id_genero: id }))
                    }
                }),
                ...(titulo && { slug: await generateUniqueSlug(titulo) }),
            });

            res.json({
                success: true,
                msg: 'Filme atualizado com sucesso',
                film: updatedFilm,
            });

        } catch (error) {
            console.log(error)
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
        const film = await getFilmById(parseInt(id));

        if (!film) {
            return res.status(404).json({success: false, msg: 'Filme não encontrado'
            });}

        try {
            await deleteFilm(parseInt(id));
            res.json({
                success: true,
                msg: 'Filme deletado com sucesso',
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, msg: 'Falha ao deletar o filme' });
        }
    },

    // Buscar filmes por gênero
    async searchFilmsByGenreController(req, res) {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(400).json({ erro: validation.array() });
        }

        const genreId = parseInt(req.query.genreId);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (isNaN(genreId) || page < 1 || limit < 1) {
            return res.status(400).json({ erro: 'Parâmetros de paginação inválidos ou ID de gênero inválido' });
        }

        try {


            const offset = (page - 1) * limit;

            const { films, totalCount } = await searchFilmsByGenre({ genreId, skip: offset, take: limit });

            res.json({
                success: true,
                msg: 'Pesquisa solicitada com sucesso',
                films,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
            });

        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao buscar os filmes' });
        }
    }
}

export default filmController;