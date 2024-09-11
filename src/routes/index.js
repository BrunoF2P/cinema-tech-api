import { Router } from 'express';
import registerRoutes from "./userRoutes.js";


const router = Router();

router.use('/', registerRoutes);

export default router;
