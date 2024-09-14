import { Router } from 'express';

import userRoutes from './userRoutes.js';
import filmRoutes from "./filmRoutes.js";
import genreRoutes from "./genreRoutes.js";
import stateRoutes from "./stateRoutes.js";
import cityRoutes from "./cityRoutes.js";

const router = Router();

router.use('/', userRoutes);
router.use('/', stateRoutes)
router.use('/', filmRoutes);
router.use('/', genreRoutes);
router.use('/', cityRoutes)


export default router;
