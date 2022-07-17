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
import { DataSource, Not, ObjectType } from 'typeorm';

type Condition = {
    entity: ObjectType<any>;
    // 默认忽略字段为id
    ignore?: string;
    // 如果没有指定字段则使用当前验证的属性作为查询依据
    property?: string;
};

/**
 * @description 在更新时验证唯一性,通过指定ignore忽略忽略的字段
 * @export
 * @class UniqueExistContraint
 * @implements {ValidatorConstraintInterface}
 */
@ValidatorConstraint({ name: 'entityItemUniqueExist', async: true })
@Injectable()
export class UniqueExistContraint implements ValidatorConstraintInterface {
    constructor(private dataSource: DataSource) {}

    async validate(value: any, args: ValidationArguments) {
        const config: Omit<Condition, 'entity'> = {
            ignore: 'id',
            property: args.property,
        };
        const condition = ('entity' in args.constraints[0]
            ? merge(config, args.constraints[0])
            : {
                  ...config,
                  entity: args.constraints[0],
              }) as unknown as Required<Condition>;
        if (!condition.entity) return false;
        // 在传入的dto数据中获取需要忽略的字段的值
        const ignoreValue = (args.object as any)[condition.ignore];
        // 如果忽略字段不存在则验证失败
        if (ignoreValue === undefined) return false;
        // 通过entity获取repository
        const repo = this.dataSource.getRepository(condition.entity);
        // 查询忽略字段之外的数据是否对queryProperty的值唯一
        return isNil(
            await repo.findOne({
                where: {
                    [condition.property]: value,
                    [condition.ignore]: Not(ignoreValue),
                },
            }),
        );
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

export function IsUniqueExist(
    params: ObjectType<any> | Condition,
    validationOptions?: ValidationOptions,
) {
    return (object: Record<string, any>, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [params],
            validator: UniqueExistContraint,
        });
    };
}
