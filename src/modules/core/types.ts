import dayjs from 'dayjs';
import { SelectQueryBuilder } from 'typeorm';

export type QueryHook<Entity> = (
    hookQuery: SelectQueryBuilder<Entity>,
) => Promise<SelectQueryBuilder<Entity>>;

/**
 * 分页验证DTO接口
 *
 * @export
 * @interface PaginateDto
 */
export interface PaginateDto {
    page: number;
    limit: number;
}

export interface TimeOptions {
    date?: dayjs.ConfigType;
    format?: dayjs.OptionType;
    locale?: string;
    strict?: boolean;
    zonetime?: string;
}

export interface AppConfig {
    timezone: string;
    locale: string;
}
