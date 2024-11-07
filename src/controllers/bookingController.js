import {
    getAllBookings,
    getBookingById,
    doesBookingExist,
    createBooking,
    updateBooking,
    getBookingsByUserId,
    availableTicketPrices
} from '../repositories/bookingRepository.js';
import {create} from "../repositories/genericRepository.js";
import prisma from "../../prismaClient.js";

const bookingController = {
    async createBookingController(req, res) {
        const { id_sessao, Cadeiras } = req.body;

        try {
            const bookings = [];
            let total = 0;

            // 1. Obter tipos de ingressos disponíveis para a sessão
            const ticketPrices = await availableTicketPrices(id_sessao);
            // 2. Criar um mapa de preços de ingresso
            const ticketPriceMap = new Map();
            ticketPrices.forEach(ticketPrice => {
                ticketPriceMap.set(ticketPrice.id_tipo, ticketPrice.preco); // Mapeia o tipo de ingresso para o seu preço
            });

            // 3. Verificar se os assentos já estão reservados e calcular o total
            for (const { id_cadeira, id_tipo_ingresso } of Cadeiras) {
                const bookingExists = await doesBookingExist(id_sessao, id_cadeira);
                if (bookingExists) {
                    return res.status(400).json({ success: false, msg: `O assento ${id_cadeira} já está reservado.` });
                }

                const ticketPrice = ticketPriceMap.get(id_tipo_ingresso);
                if (!ticketPrice) {
                    return res.status(404).json({
                        success: false,
                        msg: `Tipo de ingresso ${id_tipo_ingresso} não encontrado para a sessão ${id_sessao}.`
                    });
                }
                total += parseFloat(ticketPrice);
            }

            const bookingData = {
                id_usuario: req.user.id_usuario,
                id_sessao,
                data_reserva: new Date(),
                data_expiracao: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expiração em 24 horas
                status: 'pendente',
                total,
                Cadeiras: {
                    create: Cadeiras.map(({ id_cadeira, id_tipo_ingresso }) => ({
                        id_cadeira,
                        id_tipo_ingresso
                    }))
                }
            };

            const newBooking = await createBooking(bookingData); // Cria a reserva
            bookings.push(newBooking); // Adiciona a nova reserva ao array

            res.status(201).json({ success: true, msg: 'Reservas criadas com sucesso.', bookings });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao criar as reservas' });
        }
    },

    async getAllBookingsController(req, res) {
        try {
            const bookings = await getAllBookings();
            res.json({ success: true, msg: 'Reservas encontradas com sucesso', bookings });
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, msg: 'Falha ao buscar reservas' });
        }
    },

    async getBookingByIdController(req, res) {
        const { id_reserva } = req.params;

        try {
            const booking = await getBookingById(req.user.id_usuario, parseInt(id_reserva));
            res.json({ success: true, msg: 'Reserva encontrada com sucesso', booking });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao buscar a reserva' });
        }
    },

    async cancelBookingController(req, res) {
        const { id_reserva } = req.params;

        try {
            const booking = await getBookingById(req.user.id_usuario, parseInt(id_reserva));

            // Verifica se a reserva existe e se não está expirada
            if (!booking) {
                return res.status(404).json({ success: false, msg: 'Reserva não encontrada' });
            }

            const updatedBooking = await updateBooking(req.user.id_usuario, id_reserva, {
                status: 'cancelado'
            });

            res.json({ success: true, msg: 'Reserva cancelada com sucesso', updatedBooking });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao cancelar a reserva'});
        }
    },

    async getAllBookingsByUser(req, res) {
        try {
            const bookings = await getBookingsByUserId(req.user.id_usuario);
            res.json({ success: true, msg: 'Reservas encontradas com sucesso.', bookings });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao buscar reservas'});
        }
    },

    async getBookingByUserAndBookingId(req, res) {
        const { id_reserva } = req.params;

        try {
            const booking = await getBookingById(req.user.id_usuario, id_reserva);
            if (!booking) {
                return res.status(404).json({ success: false, msg: 'Reserva não encontrada.' });
            }
            res.json({ success: true, msg: 'Reserva encontrada com sucesso.', booking });
        } catch (error) {
            res.status(500).json({ success: false, msg: 'Falha ao buscar a reserva' });
        }
    },

    async confirmBookingController(req, res) {
        const { id_reserva } = req.params;
        const { transacao_id } = req.body;

        try {
            const booking = await getBookingById(req.user.id_usuario, parseInt(id_reserva));

            // Verifica se a reserva existe e se não está expirada
            if (!booking) {
                return res.status(404).json({ success: false, msg: 'Reserva não encontrada' });
            }

            const now = new Date();
            if (now > new Date(booking.data_expiracao)) {
                return res.status(400).json({ success: false, msg: 'Reserva expirada, por favor, tente novamente.' });
            }

            // Verifica se há cadeiras reservadas
            if (!booking.Cadeiras || booking.Cadeiras.length === 0) {
                return res.status(400).json({ success: false, msg: 'Nenhuma cadeira reservada' });
            }

            // Atualiza o status da reserva para 'confirmada' e adiciona o transacao_id
            await updateBooking(req.user.id_usuario, parseInt(id_reserva), {
                status: 'confirmado',
                transacao_id: transacao_id
            });

            const existingTickets = await prisma.Ingresso.findMany({
                where: {
                    id_sessao: booking.id_sessao,
                    id_usuario: req.user.id_usuario,
                    id_cadeira: {
                        in: booking.Cadeiras.map(c => c.id_cadeira)
                    }
                }
            });

            if (existingTickets.length > 0) {
                return res.status(400).json({ success: false, msg: 'Os ingressos já foram gerados para esta reserva.' });
            }

            // Gera os ingressos para cada cadeira reservada
            const ingressos = await Promise.all(booking.Cadeiras.map(async (cadeira) => {
                const ingressoData = {
                    id_sessao: booking.id_sessao,
                    id_usuario: req.user.id_usuario,
                    id_tipo: cadeira.tipoIngresso.id_tipo,
                    id_cadeira: cadeira.id_cadeira, // Corrigido para usar o ID correto
                    data_compra: new Date()
                };

                // Cria o ingresso no banco de dados
                const ingresso = await create('Ingresso', ingressoData);

                return {
                    id_ingresso: ingresso.id_ingresso,
                    filme: booking.sessao.filme.titulo, // Assumindo que a sessão tem um campo filme com título
                    data: booking.sessao.data_sessao, // A data da sessão
                    usuario: req.user.nome, // Nome do usuário
                    tipo_ingresso: cadeira.tipoIngresso.descricao, // Nome do tipo de ingresso
                    linha: cadeira.cadeira.linha, // Linha do assento
                    numero: cadeira.cadeira.numero // Número do assento
                };
            }));

            res.json({ success: true, msg: 'Reserva confirmada com sucesso e ingressos gerados.', ingressos });
        } catch (error) {
            console.error('Falha ao confirmar a reserva:', error);
            res.status(500).json({ success: false, msg: 'Falha ao confirmar a reserva' });
        }
    }


};

export default bookingController;
