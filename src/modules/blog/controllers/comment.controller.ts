import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    SerializeOptions,
} from '@nestjs/common';

import { CreateCommentDto } from '../dtos/comment.dto';
import { CommentService } from '../services/comment.service';

@Controller('comments')
export class CommentController {
    constructor(protected commentService: CommentService) {}

    @Get()
    @SerializeOptions({})
    async index(
        @Param('post', new ParseUUIDPipe())
        post?: string,
    ) {
        return this.commentService.find(post);
    }

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
