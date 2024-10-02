import { Router } from 'express';

import userRoutes from './userRoutes.js';
import filmRoutes from "./filmRoutes.js";
import genreRoutes from "./genreRoutes.js";
import stateRoutes from "./stateRoutes.js";
import cityRoutes from "./cityRoutes.js";
import typeRoomRoutes from "./typeRoomRoutes.js";
import roomRoutes from "./roomRoutes.js";
import chairRoutes from "./chairRoutes.js";

const router = Router();

router.use('/', userRoutes);
router.use('/', stateRoutes)
router.use('/', filmRoutes);
router.use('/', genreRoutes);
router.use('/', cityRoutes);
router.use('/', typeRoomRoutes);
router.use('/', roomRoutes);
router.use('/', chairRoutes)

export default router;
