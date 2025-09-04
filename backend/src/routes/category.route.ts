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
const router = Router();

router.use(authenticateJWT); // protéger toutes les routes

router.get("/", listCategories);
router.post("/", validateQuery(createCategorySchema), createCategory);
router.put(
  "/:id",
  validateQuery(idParamSchema),
  validateQuery(updateCategorySchema),
  updateCategory
);
router.delete("/:id", validateQuery(idParamSchema), deleteCategory);

export default router;
