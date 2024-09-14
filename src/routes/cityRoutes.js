import { Router } from 'express';
import cityController from '../controllers/cityController.js';
import {
    validateCity,
    validateCityId,
    validateCityOP
} from '../middlewares/validateCityMiddleware.js';
import { authenticateJwt, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

const adminMiddleware = [authenticateJwt, authorizeAdmin];

// Rotas para cidades
router.post('/cities', adminMiddleware, validateCityOP(false), validateCity, cityController.createCityController);
router.put('/cities/:id', [...adminMiddleware, validateCityId, validateCityOP(true)], validateCity, cityController.updateCityController);
router.delete('/cities/:id', [...adminMiddleware, validateCityId], cityController.deleteCityController);

router.get('/cities', cityController.getAllCitiesController);
router.get('/cities/:id', validateCityId, cityController.getCityByIdController);

export default router;
