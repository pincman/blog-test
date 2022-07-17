import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from '../core/core.module';
import { UserModule } from '../user/user.module';

import * as ControllerMaps from './controllers';
import * as DtoMaps from './dtos';
import * as EntityMaps from './entities';
import * as RepositoryMaps from './repositories';
import * as ServiceMaps from './services';
import * as subscriberMaps from './subscribers';

const entities = Object.values(EntityMaps);
const repositories = Object.values(RepositoryMaps);
const dtos = Object.values(DtoMaps);
const services = Object.values(ServiceMaps);
const controllers = Object.values(ControllerMaps);
const subscribers = Object.values(subscriberMaps);

@Module({
    imports: [
        TypeOrmModule.forFeature(entities),
        CoreModule.forRepository(repositories),
        UserModule,
    ],
    providers: [...services, ...dtos, ...subscribers],
    controllers,
    exports: [...services, CoreModule.forRepository(repositories)],
})
export class BlogModule {}
