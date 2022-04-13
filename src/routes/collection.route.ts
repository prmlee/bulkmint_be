import { Router } from 'express';
import { CollectionController } from '../controllers/collection.controller';

import { Routes } from '../interfaces/routes.interface';

const path: string = '/collection';
const router: Router = Router();

router.route(`${ path }`).get(CollectionController.findByNameOrSymbol);
router.route(`${path}/all`).get(CollectionController.findAll);
router.route(`${path}/:address`).get(CollectionController.findByAddress);
router.route(`${path}/create`).put(CollectionController.create);

export const CollectionRoute: Routes = { path, router };
