import { Router } from 'express';
import { TokenController } from '../controllers/token.controller';
import { Routes } from '../interfaces/routes.interface';

const path: string = '/nft';
const router: Router = Router();

router.route(`${ path }/:address/:tokenId`).get(TokenController.getMetaData);

export const NftRoute: Routes = { path, router };