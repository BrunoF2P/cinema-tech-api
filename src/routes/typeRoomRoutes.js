import {Router} from "express";
import {authenticateJwt, authorizeAdmin} from "../middlewares/authMiddleware.js";
import {validateTypeRoomId, validateTypeRoomOP} from "../middlewares/typeRoomMiddleware.js";
import typeRoomController from "../controllers/typeRoomController.js";

const router = Router();

const adminMiddleware = [authenticateJwt, authorizeAdmin];

router.post('/room-type', adminMiddleware, validateTypeRoomOP(false), typeRoomController.createTypeRoomController);
router.put('/room-type/:id_tipo_sala', [...adminMiddleware, validateTypeRoomId, validateTypeRoomOP(true)], typeRoomController.updateTypeRoomController);
router.delete('/room-type/:id_tipo_sala', [...adminMiddleware, validateTypeRoomId], typeRoomController.deleteTypeRoomController);

router.get('/room-type', typeRoomController.getAllTypeRoomsController);
router.get('/room-type/:id_tipo_sala', validateTypeRoomId, typeRoomController.getTypeRoomByIdController);

export default router;