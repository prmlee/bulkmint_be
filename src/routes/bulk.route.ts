import { Router } from 'express';
import { BulkController } from '../controllers/bulk.controller';
import { Routes } from '../interfaces/routes.interface';

const path: string = '/bulk';
const router: Router = Router();
router.route(`${ path }/all`).get(BulkController.findAll);
router.route(`${ path }/:id`).get(BulkController.findById);
router.route(`${ path }/create`).put(BulkController.create);
router.route(`${ path }/mint`).post(BulkController.mint);

export const BulkRoute: Routes = { path, router };
