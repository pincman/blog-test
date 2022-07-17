import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { userConfig } from '@/config';

import { UserRepository } from '../repositories';
import { JwtPayload, RequestUser } from '../types';

/**
 * 用户认证JWT策略
 *
 * @export
 * @class JwtStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userRepository: UserRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: userConfig().jwt.secret,
        });
    }

    /**
     * 通过荷载解析出用户ID
     * 通过用户ID查询出用户是否存在,并把id放入request方便后续操作
     *
     * @param {JwtPayload} payload
     * @returns {Promise<RequestUser>}
     * @memberof JwtStrategy
     */
    async validate(payload: JwtPayload): Promise<RequestUser> {
        const user = await this.userRepository.findOneOrFail({ where: { id: payload.sub } });
        return {
            id: user.id,
        };
    }
}
