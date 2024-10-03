import { Router } from "express";
import { authenticateJwt, authorizeAdmin } from "../middlewares/authMiddleware.js";
import {
    validateTicketPrice,
    validateTicketPriceId
} from "../middlewares/ticketPriceMiddleware.js";
import ticketPriceController from "../controllers/ticketPriceController.js";

const router = Router();

const adminMiddleware = [authenticateJwt, authorizeAdmin];

router.post('/ticket-price', adminMiddleware, validateTicketPrice(false), ticketPriceController.createTicketPriceController);
router.put('/ticket-price/:id_preco/session/:id_sessao/ticket-type/:id_tipo', [...adminMiddleware, validateTicketPriceId, validateTicketPrice(true)], ticketPriceController.updateTicketPriceController);
router.delete('/ticket-price/:id_preco', [...adminMiddleware, validateTicketPriceId], ticketPriceController.deleteTicketPriceController);

router.get('/ticket-price', ticketPriceController.getAllTicketPricesController);
router.get('/ticket-price/:id_preco', validateTicketPriceId, ticketPriceController.getTicketPriceByIdController);

export default router;