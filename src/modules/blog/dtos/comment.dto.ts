import { Injectable } from '@nestjs/common';
import { IsDefined, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';

@Injectable()
@DtoValidation({ groups: ['create'] })
export class CreateCommentDto {
    @MaxLength(1000, { message: '评论内容不得超过$constraint1个字' })
    @IsNotEmpty({ message: '评论的内容不能为空' })
    body!: string;

    @IsUUID(undefined, { message: '所属文章的ID格式错误' })
    @IsDefined({ message: '所属文章的ID必须指定' })
    post!: string;
}
