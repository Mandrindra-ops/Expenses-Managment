import { Router } from 'express';
import { signup, login, me } from '../controllers/auth.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticateJWT, me);

export default router;
