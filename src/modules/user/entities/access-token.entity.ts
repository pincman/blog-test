import { Entity, ManyToOne, OneToOne } from 'typeorm';

import { BaseToken } from './base.token';
import { RefreshTokenEntity } from './refresh-token.entity';
import { UserEntity } from './user.entity';

/**
 * 用户认证token模型
 *
 * @export
 * @class AccessTokenEntity
 * @extends {BaseToken}
 */
@Entity('user_access_tokens')
export class AccessTokenEntity extends BaseToken {
    /**
     * 关联的刷新令牌
     *
     * @type {RefreshTokenEntity}
     * @memberof AccessTokenEntity
     */
    @OneToOne(() => RefreshTokenEntity, (refreshToken) => refreshToken.accessToken, {
        cascade: true,
    })
    refreshToken!: RefreshTokenEntity;

    /**
     * 所属用户
     *
     * @type {UserEntity}
     * @memberof AccessTokenEntity
     */
    @ManyToOne((type) => UserEntity, (user) => user.accessTokens, {
        onDelete: 'CASCADE',
    })
    user!: UserEntity;
}
