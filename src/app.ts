import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Routes } from './interfaces/routes.interface';
import { createConnection } from 'typeorm';

import dbConnection from '../ormconfig';

export const rootPath = __dirname;

export const App = (routes: Routes[]) => {
  const app: express.Application = express();
  const port: string | number = process.env.PORT || 3000;
  const env: string = process.env.NODE_ENV || 'development';

  const listen = async () => {
    app.listen(port, () => {
      console.log(`=================================`);
      console.log(`======= ENV: ${env} =======`);
      console.log(`🚀 App listening on the port ${port}`);
      console.log(`=================================`);
    });
    // connect the database
    try {
      await createConnection(dbConnection);
    } catch (error) {
      console.error('db connection failed', error);
    }
  };

  const initializeMiddlewares = async () => {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  };

  const initializeRoutes = async (routes: Routes[]) => {
    routes.forEach(route => {
      app.use('/api/', cors(), route.router);
    });
  };

  const initialize = async () => {
    await initializeMiddlewares();
    await initializeRoutes(routes);
  };

  initialize();

  return { listen, app };
};
