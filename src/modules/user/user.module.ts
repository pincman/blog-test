import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from '../core/core.module';

import * as controllerMaps from './controllers';
import * as dtoMaps from './dtos';
import * as entityMaps from './entities';
import * as guardMaps from './guards';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import * as repositorieMaps from './repositories';
import * as serviceMaps from './services';
import * as strategyMaps from './strategies';
import * as subscriberMaps from './subscribers';

const entities = Object.values(entityMaps);
const repositories = Object.values(repositorieMaps);
const strategies = Object.values(strategyMaps);
const services = Object.values(serviceMaps);
const dtos = Object.values(dtoMaps);
const guards = Object.values(guardMaps);
const subscribers = Object.values(subscriberMaps);
const controllers = Object.values(controllerMaps);
@Module({
    imports: [
        TypeOrmModule.forFeature(Object.values(entities)),
        CoreModule.forRepository(Object.values(repositories)),
        PassportModule,
        serviceMaps.AuthService.jwtModuleFactory(),
    ],
    providers: [
        ...strategies,
        ...dtos,
        ...services,
        ...guards,
        ...subscribers,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
    controllers,
    exports: services,
})
export class UserModule {}
