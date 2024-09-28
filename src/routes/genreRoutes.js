import { Router } from 'express';
import genreController from '../controllers/genreController.js';
import { validateGenre, validateGenreId, validateGenreOP } from '../middlewares/genreMiddleware.js';
import { authenticateJwt, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

const adminMiddleware = [authenticateJwt, authorizeAdmin];

router.post('/genres', adminMiddleware, validateGenreOP(false), validateGenre, genreController.createGenreController);
router.put('/genres/:id', [...adminMiddleware, validateGenreId, validateGenreOP(true)], genreController.updateGenreController);
router.delete('/genres/:id', [...adminMiddleware, validateGenreId], genreController.deleteGenreController);

router.get('/genres', genreController.getAllGenresController);
router.get('/genres/:id', validateGenreId, genreController.getGenreByIdController);

export default router;