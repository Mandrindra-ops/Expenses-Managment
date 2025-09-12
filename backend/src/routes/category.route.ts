import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { listCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { validateBody, validateQuery, validateParams } from '../utils/validator';
import {createCategorySchema,updateCategorySchema} from '../validator/categories.validator'
import { idParamSchema } from '../validator/base.validator';
const router = Router();

router.use(authenticateJWT);

router.get('/', listCategories);
router.post('/',validateBody(createCategorySchema), createCategory);
router.put('/:id',validateParams(idParamSchema),validateBody(updateCategorySchema), updateCategory);
router.delete('/:id',validateParams(idParamSchema), deleteCategory);

export default router
