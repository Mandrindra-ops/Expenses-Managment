import { Router } from 'express';
import { getUserProfile, changePassword } from '../controllers/user.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.get('/profile', authenticateJWT, getUserProfile);
router.post('/change-password', authenticateJWT, changePassword);

export default router;
