import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import merge from 'deepmerge';
import { isNil } from 'lodash';
import { DataSource, ObjectType } from 'typeorm';

type Condition = {
    entity: ObjectType<any>;
    // 如果没有指定字段则使用当前验证的属性作为查询依据
    property?: string;
};
/**
 * @description 验证某个字段的唯一性
 * @export
 * @class UniqueConstraint
 * @implements {ValidatorConstraintInterface}
 */
@ValidatorConstraint({ name: 'entityItemUnique', async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
    constructor(private dataSource: DataSource) {}

    async validate(value: any, args: ValidationArguments) {
        // 获取要验证的模型和字段
        const config: Omit<Condition, 'entity'> = {
            property: args.property,
        };
        const condition = ('entity' in args.constraints[0]
            ? merge(config, args.constraints[0])
            : {
                  ...config,
                  entity: args.constraints[0],
              }) as unknown as Required<Condition>;
        if (!condition.entity) return false;
        try {
            // 查询是否存在数据,如果已经存在则验证失败
            const repo = this.dataSource.getRepository(condition.entity);
            return isNil(await repo.findOne({ where: { [condition.property]: value } }));
        } catch (err) {
            // 如果数据库操作异常则验证失败
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        const { entity, property } = args.constraints[0];
        const queryProperty = property ?? args.property;
        if (!(args.object as any).getManager) {
            return 'getManager function not been found!';
        }
        if (!entity) {
            return 'Model not been specified!';
        }
        return `${queryProperty} of ${entity.name} must been unique!`;
    }
}

export function IsUnique(
    params: ObjectType<any> | Condition,
    validationOptions?: ValidationOptions,
) {
    return (object: Record<string, any>, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [params],
            validator: UniqueConstraint,
        });
    };
}
