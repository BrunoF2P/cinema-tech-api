import { Router } from 'express';
import chairController from '../controllers/chairController.js';
import { authenticateJwt, authorizeAdmin } from '../middlewares/authMiddleware.js';
import { validationChairOP, validateChairId } from "../middlewares/chairMiddleware.js";

const router = Router();

const adminMiddleware = [authenticateJwt, authorizeAdmin];

router.post('/rooms/:id_sala/chairs', adminMiddleware, validationChairOP(false), chairController.addChairController);
router.delete('/chairs/:id_cadeira', [...adminMiddleware, validateChairId], chairController.removeChairController);
router.get('/chairs/:id_sala', chairController.getChairsByRoomController);
router.get('/rooms/:id_sala/chairs/:id_cadeira', chairController.getChairByRoomAndId);

router.put('/chairs/:id_cadeira', adminMiddleware, validationChairOP(true), chairController.updateChairController);

export default router;
