import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    SerializeOptions,
    Request,
    UseGuards,
    ForbiddenException,
} from '@nestjs/common';

import { Guest, Public, ReqUser } from '../decorators';

import { CredentialDto, UpdateUserDto } from '../dtos';
import { UserEntity } from '../entities';
import { LocalAuthGuard } from '../guards';
import { AuthService, UserService } from '../services';

/**
 * 账户中心控制器
 *
 * @export
 * @class AccountController
 * @extends {CaptchaController}
 */
@Controller('account')
export class AccountController {
    constructor(
        protected readonly userService: UserService,
        protected readonly authService: AuthService,
    ) {}

    @Public()
    @Post('init')
    @SerializeOptions({
        groups: ['user-item'],
    })
    async init(): Promise<UserEntity> {
        return this.userService.init();
    }

    @Post('login')
    @Guest()
    @UseGuards(LocalAuthGuard)
    async login(@ReqUser() user: string, @Body() _data: CredentialDto) {
        return { token: await this.authService.createToken(user) };
    }

    /**
     * 注销登录
     *
     * @param {*} req
     * @memberof AuthController
     */
    @Post('logout')
    async logout(@Request() req: any) {
        return this.authService.logout(req);
    }

    /**
     * @description 获取用户个人信息
     * @param {string} user
     */
    @Get(':id')
    @SerializeOptions({
        groups: ['user-item'],
    })
    async profile(@ReqUser() user: string) {
        try {
            return await this.userService.findOneById(user);
        } catch (error) {
            throw new ForbiddenException();
        }
    }

    /**
     * @description 更新账户信息
     * @param {UpdateUserDto} data
     */
    @Patch()
    @SerializeOptions({
        groups: ['user-item'],
    })
    async update(
        @ReqUser() user: string,
        @Body()
        data: UpdateUserDto,
    ) {
        let current: UserEntity;
        try {
            current = await this.userService.findOneById(user);
        } catch (error) {
            throw new ForbiddenException();
        }
        return this.userService.update({ id: current.id, ...data });
    }
}
