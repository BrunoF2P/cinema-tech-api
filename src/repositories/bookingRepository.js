import {checkField, checkFieldUnique, create, deleteById, findAll, findByField, update} from "./genericRepository.js";

async function getAllBookings() {
    return await findAll('Reserva', {
            Cadeiras: {
                include: {
                    cadeira: true, // Inclui detalhes da cadeira (como número, linha, etc.)
                    tipoIngresso: true // Inclui informações sobre o tipo de ingresso
                }
            }
    });
}

async function getBookingById(id_usuario, id_reserva) {
    return await checkFieldUnique('Reserva', {
        id_usuario: id_usuario,
        id_reserva: id_reserva,
    },{
        Cadeiras: {
            include: {
                cadeira: true,
                tipoIngresso: true
            }
        },
        sessao: {
            include: {
                filme: true
            }
        }
    });
}

async function doesBookingExist(id_sessao, id_cadeira) {
    const bookings = await checkField('ReservaCadeira', {
        reserva: {
            id_sessao: id_sessao,
            status: {
                in: ['pendente', 'confirmado'],
            },
        },
        id_cadeira: id_cadeira,
    });

    return bookings.length > 0;
}

async function updateBooking(userId, id_reserva, bookingData) {
   return await update('Reserva', 'id_reserva', id_reserva, bookingData);
}


async function availableTicketPrices(id_sessao) {
    return await findByField('PrecoIngresso', 'id_sessao', id_sessao, {
        tipo: true
    });
}

async function getBookingsByUserId(id_usuario) {
    const bookings = await checkField('Reserva', {
        id_usuario: id_usuario,
        status: {
            in: ['pendente', 'confirmado']
        },
    }, {
        Cadeiras: {
            include: {
                cadeira: true,
                tipoIngresso: true
            }
        }
    });

    return bookings.map(booking => ({
        id_reserva: booking.id_reserva,
        id_usuario: booking.id_usuario,
        id_sessao: booking.id_sessao,
        data_reserva: booking.data_reserva,
        data_expiracao: booking.data_expiracao,
        status: booking.status,
        total: parseFloat(booking.total).toFixed(2), // Garante que o total tenha duas casas decimais
        cadeiras: booking.Cadeiras.map(cadeira => ({
            linha: cadeira.cadeira.linha,
            numero: cadeira.cadeira.numero,
            tipo_ingresso: cadeira.tipoIngresso.descricao
        }))
    }));
}

async function createBooking(bookingData) {
    return await create('Reserva', bookingData);
}

async function deleteBooking(id_reserva) {
    return await deleteById('Reserva', 'id_reserva', id_reserva);
}

export { getAllBookings, getBookingById, doesBookingExist, availableTicketPrices, getBookingsByUserId, createBooking, updateBooking, deleteBooking };
