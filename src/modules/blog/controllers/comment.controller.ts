import {
    Body,
    CacheInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    SerializeOptions,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Public } from '@/modules/user/decorators';

import { CreateCommentDto } from '../dtos/comment.dto';
import { CommentService } from '../services/comment.service';

@ApiTags('评论')
@UseInterceptors(CacheInterceptor)
@Controller('comments')
export class CommentController {
    constructor(protected commentService: CommentService) {}

    @ApiBearerAuth()
    @Public()
    @Get()
    @SerializeOptions({})
    async index(
        @Param('post', new ParseUUIDPipe())
        post?: string,
    ) {
        return this.commentService.find(post);
    }

    @ApiBearerAuth()
    @Public()
    @Post()
    async store(
        @Body()
        data: CreateCommentDto,
    ) {
        return this.commentService.create(data);
    }

    @Delete(':comment')
    async destroy(
        @Param('comment', new ParseUUIDPipe())
        comment: string,
    ) {
        return this.commentService.delete(comment);
    }
}
