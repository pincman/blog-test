import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FastifyRequest as Request } from 'fastify';
import { ExtractJwt } from 'passport-jwt';

import { userConfig } from '@/config';
import { decrypt, getTime } from '@/modules/core/helpers';

import { UserEntity } from '../entities';

import { TokenService } from './token.service';
import { UserService } from './user.service';

/**
 * 用户认证服务
 *
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
    ) {}

    /**
     * 用户登录验证
     *
     * @param {string} credential
     * @param {string} password
     * @memberof AuthService
     */
    async validateUser(credential: string, password: string) {
        const user = await this.userService.findOneByCredential(credential, async (query) =>
            query.addSelect('user.password'),
        );
        if (user && decrypt(password, user.password)) {
            return user;
        }
        return false;
    }

    /**
     * 登录用户,并生成新的token和refreshToken
     *
     * @param {UserEntity} user
     * @returns
     * @memberof AuthService
     */
    async login(user: UserEntity) {
        const now = getTime();
        const { accessToken } = await this.tokenService.generateAccessToken(user, now);
        return accessToken.value;
    }

    /**
     * 注销登录
     *
     * @param {Request} req
     * @returns
     * @memberof AuthService
     */
    async logout(req: Request) {
        const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req as any);
        if (accessToken) {
            await this.tokenService.removeAccessToken(accessToken);
        }

        return {
            msg: 'logout_success',
        };
    }

    /**
     * 导入Jwt模块
     *
     * @static
     * @returns
     * @userof AuthService
     */
    static jwtModuleFactory() {
        return JwtModule.registerAsync({
            useFactory: () => {
                const config = userConfig();
                return {
                    secret: config.jwt.secret,
                    ignoreExpiration: process.env.NODE_ENV === 'development',
                    signOptions: { expiresIn: `${config.jwt.token_expired}s` },
                };
            },
        });
    }

    /**
     * 登录用户后生成新的token和refreshToken
     *
     * @param {UserEntity} user
     * @memberof AuthService
     */
    async createToken(id: string) {
        const now = getTime();
        let user: UserEntity;
        try {
            user = await this.userService.findOneById(id);
        } catch (error) {
            throw new ForbiddenException();
        }
        const { accessToken } = await this.tokenService.generateAccessToken(user, now);
        return accessToken.value;
    }
}
