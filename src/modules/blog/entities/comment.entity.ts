import { Expose, Type } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { PostEntity } from './post.entity';

@Expose()
@Entity('blog_comments')
export class CommentEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ comment: 'comment content' })
    content!: string;

    @Type(() => Date)
    @CreateDateColumn({
        comment: 'created time of comment',
    })
    createdAt!: Date;

    @ManyToOne(() => PostEntity, (post) => post.comments, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    post!: PostEntity;
}
