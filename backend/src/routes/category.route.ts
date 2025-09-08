import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { listCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { validateBody, validateQuery } from '../utils/validator';
import {createCategorySchema,updateCategorySchema} from '../validator/categories.validator'
import { idParamSchema } from '../validator/base.validator';
const router = Router();

router.use(authenticateJWT);

router.get('/', listCategories);
router.post('/',validateBody(createCategorySchema), createCategory);
router.put('/:id',validateQuery(idParamSchema),validateQuery(updateCategorySchema), updateCategory);
router.delete('/:id',validateQuery(idParamSchema), deleteCategory);

export default router
