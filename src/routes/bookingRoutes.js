import { Router } from "express";
import { authenticateJwt, authorizeAdmin } from "../middlewares/authMiddleware";
import bookingController from "../controllers/bookingController";

const router = Router();

// Rotas para reservas
router.post('/bookings', authenticateJwt, bookingController.createBookingController);
router.get('/bookings', authenticateJwt, authorizeAdmin, bookingController.getAllBookingsController);
router.put('/bookings/:id_reserva/cancel', authenticateJwt, bookingController.cancelBookingController);
router.get('/bookings/user/all-my-user', authenticateJwt, bookingController.getAllBookingsByUser);
router.get('/bookings/user/:id_reserva', authenticateJwt, bookingController.getBookingByUserAndBookingId);
router.put('/bookings/:id_reserva/confirm', authenticateJwt, bookingController.confirmBookingController);

export default router;
