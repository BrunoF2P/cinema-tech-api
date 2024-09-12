import { Router } from 'express';
import filmController from '../controller/filmController.js';
import { authenticateJwt, authorizeAdmin } from '../middleware/authMiddleware.js';
import { validateFilm, validateFilmId, validationFilm } from '../middleware/validadeFilmMiddleware.js';

const router = Router();

const adminMiddleware = [authenticateJwt, authorizeAdmin];


router.post('/films', adminMiddleware, validationFilm, validateFilm, filmController.createFilmController);
router.put('/films/:id', [...adminMiddleware, validateFilmId, validationFilm], filmController.updateFilmController);
router.delete('/films/:id', [...adminMiddleware, validateFilmId], filmController.deleteFilmController);

router.get('/films', filmController.getAllFilmsController);
router.get('/films/title', filmController.searchFilmsByTitleController);
router.get('/films/age-rating', filmController.searchFilmsByAgeRatingController);
router.get('/films/:id', validateFilmId, filmController.getFilmByIdController);

export default router;
