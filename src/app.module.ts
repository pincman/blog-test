import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { cacheConfig, databaseConfig, elasticsearchConfig } from './config';
import { BlogModule } from './modules/blog/blog.module';
import { CoreModule } from './modules/core/core.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        BlogModule,
        UserModule,
        CoreModule.forRoot({
            database: databaseConfig(),
            elasticsearch: elasticsearchConfig(),
            cache: cacheConfig,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
