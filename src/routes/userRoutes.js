import { Router } from 'express';
import {registerUser, loginUser} from '../controllers/userController.js';
import {validadeLogin, validationRegister, validateTipeUser} from '../middlewares/userMiddleware.js';
import {authenticateJwt, authorizeAdmin} from "../middlewares/authMiddleware.js";

const router = Router();


router.get('/verify', authenticateJwt, async (req, res) => {
    try {
        // Verificando se o usuário é um admin
        if (req.user && req.user.id_tipo_usuario === 1) {
            return res.status(200).json({
                success: true,
                msg: 'Usuário autenticado como admin',
                role: 'admin',
            });
        }

        // Se não for admin, retornamos um status 200, mas com a role "user"
        return res.status(200).json({
            success: true,
            msg: 'Usuário autenticado como comum',
            role: 'user',
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            msg: 'Erro interno no servidor',
            error: err,
        });
    }
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
