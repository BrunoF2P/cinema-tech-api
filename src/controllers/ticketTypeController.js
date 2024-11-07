import {
    createTicketType, deleteTicketType,
    getAllTicketType,
    getTicketTypeById,
    updateTicketType
} from "../repositories/ticketTypeRepository.js";


const ticketTypeController = {

    async createTicketTypeController(req, res) {
        const { descricao } = req.body;

        try {
            const typeTickerData = await createTicketType({descricao});

            res.status(201).json({ success: true, msg: 'Tipo de ticket cadastrado com sucesso', typeTickerData })
        } catch (error) {
            res.status(500).json({success: false, msg: 'Falha ao cadastrar o tipo de ingresso'})
        }
    },


    async getAllTicketTypeController(req, res){

        try {
            const ticketType = await getAllTicketType();

            res.json({success: true, msg: 'Pesquisa solicitada com sucesso', ticketType })
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao buscar os tipos de ingresso' });
        }
    },

    async getTicketTypeByIdController(req, res) {
        const { id_tipo } = req.params;

        try {
            const ticketType = await getTicketTypeById(parseInt(id_tipo));

            if (!ticketType) return res.status(404).json({ success: false, msg: 'Tipo de ingresso não encontrado' });

            res.json({ success: true, msg: 'Tipo de ingresso encontrado com sucesso', ticketType });

        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao buscar o tipo de ingresso' });
        }
    },

    async updateTicketTypeController(req, res) {
        const { id_tipo } = req.params;
        const { descricao } = req.body;

        try {
            const ticketTypeData = await getTicketTypeById(parseInt(id_tipo));

            if (!ticketTypeData) {
                return res.status(404).json({ success: false, msg: 'Tipo de ingresso não encontrado' });
            }

            const updatedTicketType = await updateTicketType(parseInt(id_tipo), {
                ...(descricao && {descricao})
            });

            res.json({success: true, msg: 'Tipo de ingresso atualizado com sucesso', typeRoom: updatedTicketType});
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao atualizar o tipo de ingresso' });
        }
    },

    async deleteTicketTypeController(req, res) {
        const { id_tipo } = req.params;

        try {
            const ticketTypeData = await getTicketTypeById(parseInt(id_tipo));

            if (!ticketTypeData) {
                return res.status(404).json({ success: false, msg: 'Tipo de ingresso não encontrado' });
            }

            await deleteTicketType(parseInt(id_tipo));
            res.json({ success: true, msg: 'Tipo de ingresso deletado com sucesso' });
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, msg: 'Falha ao deletar o tipo de ingresso' });
        }

    }

}

export default ticketTypeController;