import { Router } from 'express';
import stateController from '../controllers/stateController.js';
import cityController from '../controllers/cityController.js';
import {
    validateState,
    validateStateId, validateStateOP
} from '../middlewares/validateStateMiddleware.js';
import { authenticateJwt, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

const adminMiddleware = [authenticateJwt, authorizeAdmin];


router.post('/states', adminMiddleware, validateStateOP(false), validateState, stateController.createStateController);
router.put('/states/:id', [...adminMiddleware,  validateStateId, validateStateOP(true)], validateState, stateController.updateStateController);
router.delete('/states/:id', [...adminMiddleware, validateStateId], stateController.deleteStateController);

router.get('/states', stateController.getAllStatesController);
router.get('/states/:id', validateStateId, stateController.getStateByIdController);

router.get('/states/:id/cities', validateStateId, cityController.getCitiesByStateController);

export default router;