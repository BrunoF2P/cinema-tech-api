import {
    checkSessionConflict,
    createSession, deleteSession,
    getAllSession, getFilmsComingThisMonth, getFilmsWithFutureSessions, getFilmsWithSessionsInWeek,
    getSessionById,
    getSessionByMovieId, getSessionsByDateRange,
    updateSession
} from "../repositories/sessionRepository.js";

const sessionController = {

    async createSessionController(req, res) {
        const { id_filme, id_sala, data_sessao } = req.body;

        try {
            const existingSessions = await checkSessionConflict(parseInt(id_sala), new Date(data_sessao));

            if (existingSessions.length > 0) {
                return res.status(404).json({ success: false, msg: 'Sala ocupada nesse horário', existingSessions });
            }

            const sessionData = await createSession({
                id_filme,
                id_sala,
                data_sessao: new Date(data_sessao),
            });

            res.status(201).json({ success: true, msg: 'Sessão do filme cadastrada com sucesso', sessionData });

        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao cadastrar a sessão' });
        }
    },
    
    async getAllSessionController(req ,res){
        try {
            const session = await getAllSession();

            res.json({success: true, msg: 'Pesquisa solicitada com sucesso', session })
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao buscar as sessões' });

        }
    },
    
    async getSessionByIdController(req, res){
        const { id_sessao } = req.params;
        
        try {
            const session = await getSessionById(parseInt(id_sessao));

            res.json({ success: true, msg: 'Sessão encontrada com sucesso', session });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao buscar a sessão' });
        }
    },

    async getSessionByMovieIdController(req, res){
        const { id_filme } = req.params;

        try {
            const session = await getSessionByMovieId(parseInt(id_filme));

            res.json({ success: true, msg: 'Sessão encontrada com sucesso', session });
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, msg: 'Falha ao buscar a sessão' });
        }
    },

    async  getSessionsByDateRangeController(req, res) {
        const { startDate, endDate } = req.query;  // Receber as datas como query params

        try {
            if (!startDate || !endDate) {
                return res.status(400).json({ success: false, msg: 'As datas inicial e final são obrigatórias.' });
            }

            const sessions = await getSessionsByDateRange(startDate, endDate);

            res.json({ success: true, msg: 'Sessões encontradas com sucesso', sessions });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Erro ao buscar as sessões' });
        }
    },

    async updateSessionController(req, res){
        const {id_sessao} = req.params;
        const {id_filme, id_sala, data_sessao} = req.body;

        try {
            const existingSessions = await checkSessionConflict(parseInt(id_sala), new Date(data_sessao));

            if (existingSessions.length > 0) {
                return res.status(404).json({ success: false, msg: 'Sala ocupada nesse horário', existingSessions });
            }

            const updatedSession = await updateSession(parseInt(id_sessao),{
                ...(id_filme && {id_filme}),
                ...(id_sala && {id_sala}),
                ...(data_sessao && {data_sessao: new Date(data_sessao)}),
            });

            res.json({ success: true, msg: 'Sessão do filme atualizada com sucesso', updatedSession});
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, msg: 'Falha ao atualizar a sessão' });
        }
    },

    async getFilmsWithSessionsInWeekController(req, res) {
        try {
            const films = await getFilmsWithSessionsInWeek();
            res.json({
                success: true,
                msg: 'Filmes com sessões nesta semana',
                films
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Erro ao buscar filmes com sessões' });
        }
    },

    async getFilmsWithFutureSessions(req, res) {
        try {
            const films = await getFilmsWithFutureSessions();
            res.json({
                success: true,
                msg: 'Filmes com sessões nesta semana',
                films
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Erro ao buscar filmes com sessões' });
        }
    },

    async getFilmsComingThisMonthController(req, res) {
        try {
            const films = await getFilmsComingThisMonth();
            res.json({
                success: true,
                msg: 'Filmes com sessões nesta semana',
                films
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Erro ao buscar filmes com sessões' });
        }
    },

    async deleteSessionController(req, res){
        const {id_sessao} = req.params;

        try {
            await deleteSession(parseInt(id_sessao));
            res.json({ success: true, msg: 'Sessão deletada com sucesso' });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao deletar o sessão' });

        }
    }
}

export default sessionController;