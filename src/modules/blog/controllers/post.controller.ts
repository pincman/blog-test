import {
    ParseUUIDPipe,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    SerializeOptions,
    ForbiddenException,
    UseInterceptors,
    CacheInterceptor,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { isNil } from 'lodash';

import { Public, ReqUser } from '@/modules/user/decorators';

import { UserEntity } from '@/modules/user/entities';

import { UserService } from '@/modules/user/services';

import { CreatePostDto, QueryPostDto, UpdatePostDto } from '../dtos';
import { PostService } from '../services';

/**
 * 文章控制器
 *
 * @export
 * @class PostController
 */

@ApiTags('文章')
@UseInterceptors(CacheInterceptor)
@Controller('posts')
export class PostController {
    constructor(protected postService: PostService, protected userService: UserService) {}

    /**
     * @description 查询文章列表
     */
    @Public()
    @Get()
    @SerializeOptions({})
    async index(
        @Query()
        { page, limit, search }: QueryPostDto,
    ) {
        if (!isNil(search)) return this.postService.search(search, { page, limit });
        return this.postService.paginate({ page, limit });
    }

    /**
     * 查询一篇文章
     * @param post 文章ID
     */
    @Public()
    @Get(':post')
    @SerializeOptions({ groups: ['post-detail'] })
    async show(@Param('post', new ParseUUIDPipe()) post: string) {
        return this.postService.findOne(post);
    }

    @Post()
    @ApiBearerAuth()
    @SerializeOptions({ groups: ['post-detail'] })
    async store(
        @ReqUser() user: string,
        @Body()
        data: CreatePostDto,
    ) {
        let current: UserEntity;
        try {
            current = await this.userService.findOneById(user);
        } catch (error) {
            throw new ForbiddenException();
        }
        return this.postService.create(current, data);
    }

    /**
     * @description 更新文章
     * @param {UpdatePostDto} data 文章数据
     */
    @Patch()
    @ApiBearerAuth()
    @SerializeOptions({ groups: ['post-detail'] })
    async update(
        @Body()
        data: UpdatePostDto,
    ) {
        return this.postService.update(data);
    }

    /**
     * @description 删除文章
     * @param {string} post 文章ID
     */
    @Delete(':post')
    @ApiBearerAuth()
    @SerializeOptions({ groups: ['post-detail'] })
    async destroy(
        @Param('post', new ParseUUIDPipe())
        post: string,
    ) {
        return this.postService.delete(post);
    }
}
