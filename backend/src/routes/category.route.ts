import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { listCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';

const router = Router();

router.use(authenticateJWT); // protéger toutes les routes

router.get('/', listCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
