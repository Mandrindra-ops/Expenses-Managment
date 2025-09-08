import {Router} from 'express'
import { authenticateJWT } from '../middlewares/auth.middleware';
import { validateParams } from '../utils/validator';
import { receiptIdSchema } from '../validator/receipt.validator';

const route = Router();

route.use(authenticateJWT);

route.use('/:id',validateParams(receiptIdSchema),)
export default route;
