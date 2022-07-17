import { Exclude, Expose, Type } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '@/modules/user/entities';

import { CommentEntity } from './comment.entity';

@Exclude()
@Entity('blog_posts')
export class PostEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Expose()
    @Column({ comment: 'post title' })
    title!: string;

    @Expose({ groups: ['post-detail'] })
    @Column({ comment: 'post content body' })
    body!: string;

    @Expose({ groups: ['post-list', 'post-detail'] })
    commentCount!: number;

    @OneToMany(() => CommentEntity, (comment) => comment.post, {
        cascade: true,
    })
    comments!: CommentEntity[];

    @Type(() => Date)
    @CreateDateColumn({
        comment: '文章创建时间',
    })
    createdAt!: Date;

    @Expose()
    @ManyToOne(() => UserEntity, (user) => user.posts, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    author!: UserEntity;
}
