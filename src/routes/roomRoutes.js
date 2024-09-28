import { Router } from "express";
import { authenticateJwt, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { validateRoom, validateRoomId, validateRoomOP } from "../middlewares/roomMiddleware.js";
import roomController from "../controllers/roomController.js";

const router = Router();

const adminMiddleware = [authenticateJwt, authorizeAdmin];


router.post('/rooms', adminMiddleware, validateRoomOP(false), validateRoom, roomController.createRoomController);
router.put('/rooms/:id', [...adminMiddleware, validateRoomId, validateRoomOP(true)], roomController.updateRoomController);
router.delete('/rooms/:id', [...adminMiddleware, validateRoomId], roomController.deleteRoomController);


router.get('/rooms', roomController.getAllRoomsController);
router.get('/rooms/:id', validateRoomId, roomController.getRoomByIdController);

export default router;
