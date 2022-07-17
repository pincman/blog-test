import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsEmail, IsOptional, Length, IsUUID } from 'class-validator';

import { IsModelExist, IsUnique, IsUniqueExist } from '@/modules/core/constraints';
import { DtoValidation } from '@/modules/core/decorators';

import { UserEntity } from '../entities';

@Injectable()
@DtoValidation({
    type: 'query',
    skipMissingProperties: true,
})
export class QueryUserDto {
    @ApiPropertyOptional({
        description: '当前页',
        default: 1,
    })
    @Transform((value) => Number(value))
    @IsNumber()
    page = 1;

    @ApiPropertyOptional({
        description: '每页显示数量',
        default: 10,
    })
    @Transform((value) => Number(value))
    @IsNumber()
    limit = 10;
}

@Injectable()
@DtoValidation({ groups: ['create'] })
export class CreateUserDto {
    @ApiProperty({
        description: '用户名',
    })
    @IsUnique(
        { entity: UserEntity },
        {
            groups: ['create'],
            message: '该用户名已被注册',
        },
    )
    @IsUniqueExist(
        { entity: UserEntity, ignore: 'id' },
        { groups: ['update'], message: '该用户名已被注册' },
    )
    @Length(8, 50, { always: true })
    username!: string;

    @ApiProperty({
        description: '用户密码',
    })
    @Length(8, 50, {
        always: true,
        message: '密码长度不得少于$constraint1',
    })
    password!: string;

    @ApiPropertyOptional({
        description: '用户昵称',
    })
    @Length(3, 20, {
        always: true,
        message: '昵称必须为$constraint1到$constraint2',
    })
    @IsOptional({ always: true })
    nickname?: string;

    @ApiPropertyOptional({
        description: '用户手机号码,形式: {国家代码}.{手机号}',
    })
    @IsUnique(
        { entity: UserEntity },
        {
            groups: ['create'],
            message: '该手机号码已被注册',
        },
    )
    @ApiPropertyOptional({ description: '邮箱地址' })
    @IsUnique(
        { entity: UserEntity },
        {
            groups: ['create'],
            message: '邮箱已被占用',
        },
    )
    @IsUniqueExist(
        { entity: UserEntity, ignore: 'id' },
        { groups: ['update'], message: '邮箱已被占用' },
    )
    @IsEmail(undefined, { always: true, message: '邮箱格式错误' })
    @IsOptional({ always: true })
    email?: string;
}

@Injectable()
export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsModelExist(UserEntity, {
        groups: ['update'],
        message: '用户 $value 不存在',
    })
    @IsUUID(undefined, { groups: ['update'], message: '用户ID格式不正确' })
    id!: string;
}
