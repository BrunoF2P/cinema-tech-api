import {
    getAllTicketPrices,
    getTicketPriceById,
    getTicketPriceBySessionId,
    getTicketPriceByType,
    createTicketPrice,
    updateTicketPrice,
    deleteTicketPrice, doesTicketPriceExist
} from "../repositories/ticketPriceRepository.js";

const ticketPriceController = {

    async createTicketPriceController(req, res) {
        const { id_sessao, id_tipo, preco } = req.body;

        try {

            const existingTicketPrice = await doesTicketPriceExist(id_sessao, id_tipo);

            if (existingTicketPrice.length > 0) {
                return res.status(400).json({ success: false, msg: 'Já existe um preço cadastrado para esta sessão e tipo de ingresso.' });
            }

            const ticketPriceData = await createTicketPrice({
                id_sessao,
                id_tipo,
                preco
            });

            res.status(201).json({ success: true, msg: 'Preço do ingresso cadastrado com sucesso', ticketPriceData });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Falha ao cadastrar o preço do ingresso' });
        }
    },

    async getAllTicketPricesController(req, res) {
        try {
            const ticketPrices = await getAllTicketPrices();
            res.json({ success: true, msg: 'Preços dos ingressos encontrados com sucesso', ticketPrices });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Falha ao buscar os preços dos ingressos' });
        }
    },

    async getTicketPriceByIdController(req, res) {
        const { id_preco } = req.params;

        try {
            const ticketPrice = await getTicketPriceById(parseInt(id_preco));
            if (!ticketPrice) {
                return res.status(404).json({ success: false, msg: 'Preço do ingresso não encontrado' });
            }
            res.json({ success: true, msg: 'Preço do ingresso encontrado com sucesso', ticketPrice });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Falha ao buscar o preço do ingresso' });
        }
    },

    async getTicketPriceBySessionIdController(req, res) {
        const { id_sessao } = req.params;

        try {
            const ticketPrices = await getTicketPriceBySessionId(parseInt(id_sessao));
            res.json({ success: true, msg: 'Preços dos ingressos encontrados com sucesso', ticketPrices });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Falha ao buscar os preços dos ingressos' });
        }
    },

    async getTicketPriceByTypeController(req, res) {
        const { id_tipo } = req.params;

        try {
            const ticketPrices = await getTicketPriceByType(parseInt(id_tipo));
            res.json({ success: true, msg: 'Preços dos ingressos encontrados com sucesso', ticketPrices });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Falha ao buscar os preços dos ingressos' });
        }
    },

    async updateTicketPriceController(req, res) {
        const { id_preco, id_sessao, id_tipo } = req.params;
        const { preco } = req.body;

        try {
            const updateData = {
                ...(preco !== undefined && { preco }) 
            };

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ success: false, msg: 'Nenhum campo para atualizar fornecido.' });
            }

            const updatedTicketPrice = await updateTicketPrice(parseInt(id_preco), {
                ...updateData,
                id_sessao: parseInt(id_sessao),
                id_tipo: parseInt(id_tipo) 
            });

            if (!updatedTicketPrice) {
                return res.status(404).json({ success: false, msg: 'Preço do ingresso não encontrado.' });
            }

            res.json({ success: true, msg: 'Preço do ingresso atualizado com sucesso', updatedTicketPrice });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Falha ao atualizar o preço do ingresso' });
        }
    },

    async deleteTicketPriceController(req, res) {
        const { id_preco } = req.params;

        try {
            await deleteTicketPrice(parseInt(id_preco));
            res.json({ success: true, msg: 'Preço do ingresso deletado com sucesso' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, msg: 'Falha ao deletar o preço do ingresso' });
        }
    }
};

export default ticketPriceController;
