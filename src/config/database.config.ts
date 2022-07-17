import { resolve } from 'path';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: () => TypeOrmModuleOptions = () => ({
    // type: 'mysql',
    // host: '127.0.0.1',
    // port: 3306,
    // username: 'root',
    // password: '123456',
    // database: 'forum',
    type: 'sqlite',
    database: resolve(__dirname, '../database/database.sqlite'),
    entities: [],
    autoLoadEntities: true,
    synchronize: true,
});
