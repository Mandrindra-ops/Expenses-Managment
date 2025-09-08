<<<<<<< HEAD
import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { validateQuery } from "../utils/validator";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validator/categories.validator";
import { idParamSchema } from "../validator/base.validator";
=======
import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { listCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { validateBody, validateQuery } from '../utils/validator';
import {createCategorySchema,updateCategorySchema} from '../validator/categories.validator'
import { idParamSchema } from '../validator/base.validator';
>>>>>>> 86765c6 ([fix] change validator on income)
const router = Router();

router.use(authenticateJWT);

<<<<<<< HEAD
router.get("/", listCategories);
router.post("/", validateQuery(createCategorySchema), createCategory);
router.put(
  "/:id",
  validateQuery(idParamSchema),
  validateQuery(updateCategorySchema),
  updateCategory
);
router.delete("/:id", validateQuery(idParamSchema), deleteCategory);
=======
router.get('/', listCategories);
router.post('/',validateBody(createCategorySchema), createCategory);
router.put('/:id',validateQuery(idParamSchema),validateQuery(updateCategorySchema), updateCategory);
router.delete('/:id',validateQuery(idParamSchema), deleteCategory);
>>>>>>> 86765c6 ([fix] change validator on income)

export default router;
