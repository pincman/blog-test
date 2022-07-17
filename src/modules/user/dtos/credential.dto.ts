import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

@Injectable()
export class CredentialDto {
    @ApiProperty({
        description: '登录凭证,可以是用户名,手机号或邮箱地址',
    })
    @IsNotEmpty({ message: '登录凭证不得为空' })
    readonly credential!: string;

    @ApiProperty({
        description: '用户密码',
    })
    @IsNotEmpty({ message: '密码必须填写' })
    readonly password!: string;
}
