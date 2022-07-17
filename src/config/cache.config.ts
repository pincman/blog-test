import { CacheModuleOptions } from '@nestjs/common';

export const cacheConfig: () => CacheModuleOptions = () => ({
    ttl: 5,
    max: 10,
});
