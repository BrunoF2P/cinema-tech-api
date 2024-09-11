import { Router } from 'express';
import {registerUser} from '../controller/userController.js';
import {validationRules, validateUser, tipoUsuarioValidation} from '../middleware/validationUserMiddleware.js';

const router = Router();

router.post('/register',
    validationRules,
    validateUser,
    tipoUsuarioValidation,
    registerUser
);

export default router;
