import { ConnectionOptions } from 'typeorm';

const env = process.env.NODE_ENV || 'development';
const db = process.env.CURRENT_DATABASE || 'mysql';

const dbConnection: ConnectionOptions = {
  type: db === 'mysql' ? 'mysql' : 'postgres',
  host: db === 'mysql' ? process.env.MYSQL_HOST : process.env.POSTGRESQL_HOST,
  port: 'mysql' ? Number(process.env.MYSQL_PORT) : Number(process.env.POSTGRESQL_PORT),
  username: 'mysql' ? process.env.MYSQL_USERNAME : process.env.POSTGRESQL_USERNAME,
  password: 'mysql' ? process.env.MYSQL_PASSWORD : process.env.POSTGRESQL_PASSWORD,
  database: 'mysql' ? process.env.MYSQL_DATABASE : process.env.POSTGRESQL_DATABASE,
  synchronize: false,
  logging: false,
  entities: [env === 'production' ? 'build/database/entities/*{.ts,.js}' : 'src/database/entities/*{.ts,.js}'],
  migrations: [env === 'production' ? 'build/database/migrations/*{.ts,.js}' : 'src/database/migrations/*{.ts,.js}'],
  subscribers: [env === 'production' ? 'build/database/subscribers/*{.ts,.js}' : 'src/database/subscribers/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src/database/entities',
    migrationsDir: 'src/database/migrations',
    subscribersDir: 'src/database/subscribers',
  },
};

export default dbConnection;
