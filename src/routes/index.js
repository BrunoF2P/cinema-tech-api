import { Router } from 'express';

import userRoutes from './userRoutes.js';
import filmesRoutes from "./filmRoutes.js";

const router = Router();

router.use('/', userRoutes);
router.use('/', filmesRoutes)


export default router;
