import { Type } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { PostEntity } from '@/modules/blog/entities';

import { AccessTokenEntity } from './access-token.entity';

/**
 * 用户模型
 *
 * @export
 * @class UserEntity
 */
@Entity('users')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        comment: '姓名',
        nullable: true,
    })
    nickname?: string;

    @Column({ comment: '用户名', unique: true })
    username!: string;

    @Column({ comment: '密码', length: 500, select: false })
    password!: string;

    @Column({ comment: '邮箱', nullable: true, unique: true })
    email?: string;

    @Type(() => Date)
    @CreateDateColumn({
        comment: '用户创建时间',
    })
    createdAt!: Date;

    @OneToMany(() => AccessTokenEntity, (accessToken) => accessToken.user, {
        cascade: true,
    })
    accessTokens!: AccessTokenEntity[];

    @OneToMany(() => PostEntity, (post) => post.author, {
        cascade: true,
    })
    posts!: PostEntity[];
}
