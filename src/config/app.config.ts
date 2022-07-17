import { AppConfig } from '@/modules/core/types';

/**
 * 应用配置
 */
export const appConfig: () => AppConfig = () => ({
    // 默认时区
    timezone: 'Asia/Shanghai',
    // 默认语言
    locale: 'zh-cn',
});
