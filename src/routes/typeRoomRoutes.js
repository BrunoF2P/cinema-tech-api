import {Router} from "express";
import {authenticateJwt, authorizeAdmin} from "../middlewares/authMiddleware.js";
import {validateTypeRoom, validateTypeRoomId, validateTypeRoomOP} from "../middlewares/typeRoomMiddleware.js";
import typeRoomController from "../controllers/typeRoomController.js";

const router = Router();

const adminMiddleware = [authenticateJwt, authorizeAdmin];

router.post('/type_rooms', adminMiddleware, validateTypeRoomOP(false), validateTypeRoom, typeRoomController.createTypeRoomController);
router.put('/type_rooms/:id', [...adminMiddleware, validateTypeRoomId, validateTypeRoomOP(true)], typeRoomController.updateTypeRoomController);
router.delete('/type_rooms/:id', [...adminMiddleware, validateTypeRoomId], typeRoomController.deleteTypeRoomController);

router.get('/type_rooms', typeRoomController.getAllTypeRoomsController);
router.get('/type_rooms/:id', validateTypeRoom, typeRoomController.getTypeRoomByIdController);

export default router;