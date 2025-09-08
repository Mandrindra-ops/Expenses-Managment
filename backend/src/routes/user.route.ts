import { Router } from 'express';
import { getUserProfile, changePassword } from '../controllers/user.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { validateBody } from '../utils/validator';
import { changePasswordSchema } from '../validator/user.validator';

const router = Router();

router.use(authenticateJWT);

router.get('/profile', getUserProfile);
router.post('/change-password', validateBody(changePasswordSchema), changePassword
);

export default router;
