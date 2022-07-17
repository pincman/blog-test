import { Repository } from 'typeorm';

import { CustomRepository } from '@/modules/core/decorators';

import { CommentEntity } from '../entities';
import { PostEntity } from '../entities/post.entity';

@CustomRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
    buildBaseQuery() {
        return this.createQueryBuilder('post')
            .leftJoinAndSelect('post.comments', 'comments')
            .addSelect((subQuery) => {
                return subQuery
                    .from(CommentEntity, 'c')
                    .select('COUNT(c.id)', 'count')
                    .where('c.post.id = post.id');
            }, 'commentCount')
            .loadRelationCountAndMap('post.commentCount', 'post.comments')
            .leftJoinAndSelect('post.author', 'author');
    }
}
