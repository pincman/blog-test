import {
    CacheModule,
    CacheModuleOptions,
    DynamicModule,
    ModuleMetadata,
    Provider,
    Type,
} from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ElasticsearchModule, ElasticsearchModuleOptions } from '@nestjs/elasticsearch';
import { getDataSourceToken, TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, ObjectType } from 'typeorm';

import { CUSTOM_REPOSITORY_DATAMETA } from './constants';
import { UniqueConstraint, UniqueExistContraint } from './constraints';
import { AppFilter, AppIntercepter, AppPipe } from './providers';

export class CoreModule {
    public static forRoot(options: {
        database: TypeOrmModuleOptions;
        elasticsearch: ElasticsearchModuleOptions;
        cache: CacheModuleOptions;
    }) {
        const imports: ModuleMetadata['imports'] = [
            TypeOrmModule.forRoot(options.database),
            ElasticsearchModule.register(options.elasticsearch),
            CacheModule.register({ ...options.cache, isGlobal: true }),
        ];
        const providers: ModuleMetadata['providers'] = [
            {
                provide: APP_PIPE,
                useFactory: () =>
                    new AppPipe({
                        transform: true,
                        forbidUnknownValues: false,
                        validationError: { target: false },
                    }),
            },
            {
                provide: APP_FILTER,
                useClass: AppFilter,
            },
            {
                provide: APP_INTERCEPTOR,
                useClass: AppIntercepter,
            },
            UniqueConstraint,
            UniqueExistContraint,
        ];
        return {
            global: true,
            imports,
            providers,
            exports: [ElasticsearchModule],
            module: CoreModule,
        };
    }

    public static forRepository<T extends Type<any>>(
        repositories: T[],
        dataSourceName?: string,
    ): DynamicModule {
        const providers: Provider[] = [];

        for (const Repo of repositories) {
            const entity = Reflect.getMetadata(CUSTOM_REPOSITORY_DATAMETA, Repo);

            if (!entity) {
                continue;
            }

            providers.push({
                inject: [getDataSourceToken(dataSourceName)],
                provide: Repo,
                useFactory: (dataSource: DataSource): typeof Repo => {
                    const base = dataSource.getRepository<ObjectType<any>>(entity);
                    return new Repo(base.target, base.manager, base.queryRunner);
                },
            });
        }

        return {
            exports: providers,
            module: CoreModule,
            providers,
        };
    }
}
