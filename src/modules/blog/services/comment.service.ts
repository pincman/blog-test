import { Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { EntityNotFoundError } from 'typeorm';

import { CreateCommentDto } from '../dtos/comment.dto';
import { PostEntity } from '../entities';

import { CommentEntity } from '../entities/comment.entity';
import { CommentRepository, PostRepository } from '../repositories';

@Injectable()
export class CommentService {
    constructor(
        protected commentRepository: CommentRepository,
        protected postRepository: PostRepository,
    ) {}

    async find(post?: string) {
        const query = this.postRepository.buildBaseQuery();
        return isNil(post) ? query.where('post.id = :id', { id: post }).getMany() : query.getMany();
    }

    async create(data: CreateCommentDto) {
        const item = await this.commentRepository.save({
            ...data,
            post: await this.getPost(data.post),
        });
        return this.commentRepository.findOneOrFail({ where: { id: item.id } });
    }

    async delete(id: string) {
        const comment = await this.commentRepository.findOne({ where: { id } });
        if (!comment) throw new EntityNotFoundError(CommentEntity, `Comment ${id} not found`);
        return this.commentRepository.remove(comment);
    }

    protected async getPost(id: string) {
        const post = await this.postRepository.findOne({ where: { id } });
        if (isNil(post)) {
            throw new EntityNotFoundError(
                PostEntity,
                `The post ${id} which comment belongs not exists!`,
            );
        }
        return post;
    }
}
