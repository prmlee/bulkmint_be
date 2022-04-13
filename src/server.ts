import 'dotenv/config';
import { App } from './app';
import { CollectionRoute } from './routes/collection.route';
import { BulkRoute } from './routes/bulk.route';
import { TokenRoute } from './routes/token.route';
import { NftRoute } from './routes/nft.route';

const { listen } = App([TokenRoute, CollectionRoute, BulkRoute, NftRoute]);

listen();
