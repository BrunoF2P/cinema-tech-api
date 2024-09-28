import { Router } from 'express';
import filmController from '../controllers/filmController.js';
import { authenticateJwt, authorizeAdmin } from '../middlewares/authMiddleware.js';
import { validateFilm, validateFilmId, validationFilmOP } from '../middlewares/filmMiddleware.js';

const router = Router();

const adminMiddleware = [authenticateJwt, authorizeAdmin];


router.post('/films', adminMiddleware, validationFilmOP(false), validateFilm, filmController.createFilmController);
router.put('/films/:id', [...adminMiddleware, validateFilmId, validationFilmOP(true)], filmController.updateFilmController);
router.delete('/films/:id', [...adminMiddleware, validateFilmId], filmController.deleteFilmController);

router.get('/films', filmController.getAllFilmsController);
router.get('/films/title', filmController.searchFilmsByTitleController);
router.get('/films/age-rating', filmController.searchFilmsByAgeRatingController);
router.get('/films/genre', filmController.searchFilmsByGenreController);
router.get('/films/:id', validateFilmId, filmController.getFilmByIdController);

export default router;
