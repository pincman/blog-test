import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';
import { FastifyReply as Response } from 'fastify';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

import { userConfig } from '@/config';

import { getTime } from '@/modules/core/helpers';

import { AccessTokenEntity, RefreshTokenEntity, UserEntity } from '../entities';
import { JwtConfig, JwtPayload } from '../types';

/**
 * 令牌服务
 *
 * @export
 * @class TokenService
 */
@Injectable()
export class TokenService {
    private readonly config: JwtConfig;

    constructor(protected readonly jwtService: JwtService) {
        this.config = userConfig().jwt;
    }

    /**
     * 根据accessToken刷新AccessToken与RefreshToken
     *
     * @param {Request} request
     * @param {Response} response
     * @returns
     * @memberof TokenService
     */
    async refreshToken(accessToken: AccessTokenEntity, response: Response) {
        const { user, refreshToken } = accessToken;
        if (refreshToken) {
            const now = getTime();
            // 判断refreshToken是否过期
            if (now.isAfter(refreshToken.expired_at)) return null;
            // 如果没过期则生成新的access_token和refresh_token
            const token = await this.generateAccessToken(user, now);
            await accessToken.remove();
            response.header('token', token.accessToken.value);
            return token;
        }
        return null;
    }

    /**
     * 根据荷载签出新的AccessToken并存入数据库
     * 且自动生成新的Refresh也存入数据库
     *
     * @param {UserEntity} user
     * @param {dayjs.Dayjs} now
     * @returns
     * @memberof TokenService
     */
    async generateAccessToken(user: UserEntity, now: dayjs.Dayjs) {
        const accessTokenPayload: JwtPayload = {
            sub: user.id,
            iat: now.unix(),
        };
        const signed = this.jwtService.sign(accessTokenPayload);
        const accessToken = new AccessTokenEntity();
        accessToken.value = signed;
        accessToken.user = user;
        accessToken.expired_at = now.add(this.config.token_expired, 'second').toDate();
        await accessToken.save();
        const refreshToken = await this.generateRefreshToken(accessToken, getTime());
        return { accessToken, refreshToken };
    }

    /**
     * 生成新的RefreshToken并存入数据库
     *
     * @param {AccessTokenEntity} accessToken
     * @param {dayjs.Dayjs} now
     * @returns {Promise<RefreshTokenEntity>}
     * @memberof TokenService
     */
    async generateRefreshToken(
        accessToken: AccessTokenEntity,
        now: dayjs.Dayjs,
    ): Promise<RefreshTokenEntity> {
        const refreshTokenPayload = {
            uuid: uuid(),
        };
        const refreshToken = new RefreshTokenEntity();
        refreshToken.value = jwt.sign(refreshTokenPayload, this.config.refresh_secret);
        refreshToken.expired_at = now.add(this.config.refresh_token_expired, 'second').toDate();
        refreshToken.accessToken = accessToken;
        await refreshToken.save();
        return refreshToken;
    }

    /**
     * 检查accessToken是否存在
     *
     * @param {string} value
     * @returns
     * @memberof TokenService
     */
    async checkAccessToken(value: string) {
        return AccessTokenEntity.findOne({
            where: { value },
            relations: ['user', 'refreshToken'],
        });
    }

    /**
     * 移除AccessToken且自动移除关联的RefreshToken
     *
     * @param {string} value
     * @memberof TokenService
     */
    async removeAccessToken(value: string) {
        const accessToken = await AccessTokenEntity.findOne({
            where: { value },
        });
        if (accessToken) await accessToken.remove();
    }

    /**
     * 移除RefreshToken
     *
     * @param {string} value
     * @memberof TokenService
     */
    async removeRefreshToken(value: string) {
        const refreshToken = await RefreshTokenEntity.findOne({
            where: { value },
            relations: ['accessToken'],
        });
        if (refreshToken) {
            if (refreshToken.accessToken) await refreshToken.accessToken.remove();
            await refreshToken.remove();
        }
    }
}
