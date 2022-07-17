import { UserConfig } from '@/modules/user/types';

/**
 * 用户模块配置
 */
export const userConfig: () => UserConfig = () => ({
    hash: 10,
    jwt: {
        secret: 'my-secret',
        token_expired: 3600,
        refresh_secret: 'my-refresh-secret',
        refresh_token_expired: 3600 * 30,
    },
});
