import { Router } from 'express';
import { TokenController } from '../controllers/token.controller';
import { Routes } from '../interfaces/routes.interface';
import { TokenValidator } from '../middlewares/validators/token.validator';

const path: string = '/token';
const router: Router = Router();

router.route(`${path}/:id`).get(TokenValidator.get, TokenController.get);

export const TokenRoute: Routes = { path, router };
