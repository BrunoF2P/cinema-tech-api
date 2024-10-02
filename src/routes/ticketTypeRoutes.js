import {Router} from "express";
import {authenticateJwt, authorizeAdmin} from "../middlewares/authMiddleware.js";
import {validateTicketType, validateTicketTypeId} from "../middlewares/ticketTypeMiddleware.js";
import ticketTypeController from "../controllers/ticketTypeController.js";


const router = Router();

const adminMiddleware = [authenticateJwt, authorizeAdmin];

router.post('/ticket-type', adminMiddleware, validateTicketType(false), ticketTypeController.createTicketTypeController);
router.put('/ticket-type/:id_tipo', [...adminMiddleware, validateTicketTypeId, validateTicketType(true)], ticketTypeController.updateTicketTypeController);
router.delete('/ticket-type/:id_tipo', [...adminMiddleware, validateTicketTypeId], ticketTypeController.deleteTicketTypeController);

router.get('/ticket-type', ticketTypeController.getAllTicketTypeController);
router.get('/ticket-type/:id_tipo', validateTicketTypeId, ticketTypeController.getTicketTypeByIdController);

export default router;