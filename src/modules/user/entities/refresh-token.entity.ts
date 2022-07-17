import { Entity, JoinColumn, OneToOne } from 'typeorm';

import { AccessTokenEntity } from './access-token.entity';
import { BaseToken } from './base.token';

/**
 * 刷新Token的Token模型
 *
 * @export
 * @class RefreshTokenEntity
 * @extends {BaseToken}
 */
@Entity('user_refresh_tokens')
export class RefreshTokenEntity extends BaseToken {
    /**
     * 关联的登录令牌
     *
     * @type {AccessTokenEntity}
     * @memberof RefreshTokenEntity
     */
    @OneToOne(() => AccessTokenEntity, (accessToken) => accessToken.refreshToken, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    accessToken!: AccessTokenEntity;
}
