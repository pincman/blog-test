import { ClassSerializerInterceptor, PlainLiteralObject } from '@nestjs/common';
import { ClassTransformOptions } from '@nestjs/common/interfaces/external/class-transform-options.interface';
import { isObject } from 'lodash';

/**
 * @description 全局拦截器,用于序列化数据
 * @export
 * @class AppIntercepter
 * @extends {ClassSerializerInterceptor}
 */
export class AppIntercepter extends ClassSerializerInterceptor {
    serialize(
        response: PlainLiteralObject | Array<PlainLiteralObject>,
        options: ClassTransformOptions,
    ): PlainLiteralObject | PlainLiteralObject[] {
        const isArray = Array.isArray(response);
        if (!isObject(response) && !isArray) return response;
        // 如果是响应数据是数组,则遍历对每一项进行序列化
        if (isArray) {
            return (response as PlainLiteralObject[]).map((item) =>
                this.transformToPlain(item, options),
            );
        }
        // 如果是分页数据,则对items中的每一项进行序列化
        if ('meta' in response && 'items' in response && Array.isArray(response.items)) {
            return {
                ...response,
                items: (response.items as PlainLiteralObject[]).map((item) =>
                    this.transformToPlain(item, options),
                ),
            };
        }
        // 如果响应是个对象则直接序列化
        return this.transformToPlain(response, options);
    }
}
