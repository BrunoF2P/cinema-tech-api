import {Router} from "express";
import {authenticateJwt, authorizeAdmin} from "../middlewares/authMiddleware.js";
import {
    validateSession,
    validateSessionDateRange,
    validateSessionId,
    validateSessionMovieId
} from "../middlewares/sessionMiddleware.js";
import sessionController from "../controllers/sessionController.js";

const router = Router();

const adminMiddleware = [authenticateJwt, authorizeAdmin];

router.post('/sessions', adminMiddleware, validateSession(false), sessionController.createSessionController );
router.put('/sessions/:id_sessao', [...adminMiddleware, validateSessionId, validateSession(true)], sessionController.updateSessionController);
router.delete('/sessions/:id_sessao', [...adminMiddleware, validateSessionId], sessionController.deleteSessionController);

router.get('/sessions/this-coming-month', sessionController.getFilmsComingThisMonthController);
router.get('/sessions/this-week', sessionController.getFilmsWithSessionsInWeekController);

router.get('/sessions', sessionController.getAllSessionController);
router.get('/sessions/:id_sessao', validateSessionId, sessionController.getSessionByIdController);
router.get('/sessions/movie/:id_filme', validateSessionMovieId, sessionController.getSessionByMovieIdController);
router.get('/sessions/date-range', validateSessionDateRange, sessionController.getSessionsByDateRangeController);




export default router;