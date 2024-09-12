import { Router } from 'express';
import {registerUser, loginUser} from '../controller/userController.js';
import {validadeLogin, validationRegister, validateTipeUser} from '../middleware/validationUserMiddleware.js';

const router = Router();

router.post('/register',
    validationRegister,
    validateTipeUser,
    registerUser
);

router.post('/login',
    validadeLogin,
    loginUser

);

export default router;
