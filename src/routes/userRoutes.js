import { Router } from 'express';
import {registerUser, loginUser} from '../controllers/userController.js';
import {validadeLogin, validationRegister, validateTipeUser} from '../middlewares/userMiddleware.js';

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
