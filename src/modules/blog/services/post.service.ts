import { Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { paginate } from 'nestjs-typeorm-paginate';
import { EntityNotFoundError, In } from 'typeorm';

import { manualPaginate } from '@/modules/core/helpers';
import { PaginateDto } from '@/modules/core/types';
import { UserEntity } from '@/modules/user/entities';

import { CreatePostDto, UpdatePostDto } from '../dtos';

import { PostEntity } from '../entities';

import { PostRepository } from '../repositories';

import { PostsSearchService } from './postsSearch.service';

@Injectable()
export class PostService {
    constructor(
        protected postRepository: PostRepository,
        private postsSearchService: PostsSearchService,
    ) {}

    async paginate(options: PaginateDto) {
        const query = this.postRepository.buildBaseQuery().orderBy('post.createdAt', 'DESC');
        return paginate<PostEntity>(query, options);
    }

    async search(text: string, options: PaginateDto) {
        const results = await this.postsSearchService.search(text);
        const ids = results.map((result: { id: any }) => result.id);
        const data =
            ids.length <= 0
                ? []
                : await this.postRepository.find({
                      where: { id: In(ids) },
                  });
        return manualPaginate(options, data);
    }

    async findOne(id: string) {
        const item = this.postRepository.buildBaseQuery().where('post.id = :id', { id }).getOne();
        if (isNil(item)) throw new EntityNotFoundError(PostEntity, `Post ${id} not exists!`);
        return item;
    }

    async create(author: UserEntity, data: CreatePostDto) {
        const item = await this.postRepository.save({ ...data, author });
        const post = await this.findOne(item.id);
        try {
            await this.postsSearchService.indexPost(post);
        } catch (err) {
            console.log(err);
        }

        return this.findOne(item.id);
    }

    async update(data: UpdatePostDto) {
        const { id, ...querySet } = data;
        if (Object.keys(querySet).length > 0) {
            await this.postRepository.update(id, querySet);
        }
        return this.findOne(data.id);
    }

    async delete(id: string) {
        const post = await this.postRepository.findOne({ where: { id } });
        if (!post) throw new EntityNotFoundError(PostEntity, `Post ${id} not exists!`);
        await this.postsSearchService.remove(id);
        return this.postRepository.remove(post);
    }
}
