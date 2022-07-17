import { Repository } from 'typeorm';

import { CustomRepository } from '@/modules/core/decorators';

import { CommentEntity } from '../entities';

@CustomRepository(CommentEntity)
export class CommentRepository extends Repository<CommentEntity> {
    buildBaseQuery() {
        return this.createQueryBuilder('comment').leftJoinAndSelect('comment.post', 'post');
    }
}
