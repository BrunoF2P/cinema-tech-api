import { Router } from 'express';
import {registerUser, loginUser} from '../controllers/userController.js';
import {validadeLogin, validationRegister, validateTipeUser} from '../middlewares/userMiddleware.js';
import {authenticateJwt, authorizeAdmin} from "../middlewares/authMiddleware.js";

const router = Router();


router.get('/verify', authenticateJwt, authorizeAdmin, (req, res) => {
    res.status(200).json({ success: true, msg: 'Bem-vindo ao painel de administração!' });
});

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
