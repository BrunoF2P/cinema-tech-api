import { Router } from 'express';

import userRoutes from './userRoutes.js';
import filmRoutes from "./filmRoutes.js";
import genreRoutes from "./genreRoutes.js";
import stateRoutes from "./stateRoutes.js";
import cityRoutes from "./cityRoutes.js";
import typeRoomRoutes from "./typeRoomRoutes.js";
import roomRoutes from "./roomRoutes.js";
import chairRoutes from "./chairRoutes.js";
import ticketTypeRoutes from "./ticketTypeRoutes.js";
import sessionRoutes from "./sessionRoutes.js";

const router = Router();

router.use(userRoutes);
router.use(stateRoutes)
router.use(filmRoutes);
router.use(genreRoutes);
router.use(cityRoutes);
router.use(typeRoomRoutes);
router.use(roomRoutes);
router.use(chairRoutes)
router.use(ticketTypeRoutes)
router.use(sessionRoutes);

export default router;

