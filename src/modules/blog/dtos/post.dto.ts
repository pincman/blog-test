import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDefined,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
    MaxLength,
    Min,
} from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
import { tNumber } from '@/modules/core/helpers';

import { PaginateDto } from '@/modules/core/types';

@Injectable()
@DtoValidation({ type: 'query' })
export class QueryPostDto implements PaginateDto {
    /**
     * 当前分页
     *
     * @memberof QueryPostDto
     */
    @Transform(({ value }) => tNumber(value))
    @Min(1, { message: '当前页必须大于1' })
    @IsNumber()
    @IsOptional()
    page = 1;

    /**
     * 每页显示数据
     *
     * @memberof QueryPostDto
     */
    @Transform(({ value }) => tNumber(value))
    @Min(1, { message: '每页显示数据必须大于1' })
    @IsNumber()
    @IsOptional()
    limit = 10;

    @MaxLength(50, {
        always: true,
        message: '搜索关键字长度最大为$constraint1',
    })
    @IsOptional({ always: true })
    search?: string;
}

@Injectable()
@DtoValidation({ groups: ['create'] })
export class CreatePostDto {
    @MaxLength(255, {
        always: true,
        message: '文章标题长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '文章标题必须填写' })
    @IsOptional({ groups: ['update'] })
    title!: string;

    @IsNotEmpty({ groups: ['create'], message: '文章内容必须填写' })
    @IsOptional({ groups: ['update'] })
    body!: string;
}

@Injectable()
@DtoValidation({ groups: ['update'] })
export class UpdatePostDto extends PartialType(CreatePostDto) {
    @IsUUID(undefined, { groups: ['update'], message: '文章ID格式错误' })
    @IsDefined({ groups: ['update'], message: '文章ID必须指定' })
    id!: string;
}
