import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { PostEntity } from '../entities';
import { PostSearchBody } from '../types';

@Injectable()
export class PostsSearchService {
    index = 'posts';

    constructor(private readonly elasticsearchService: ElasticsearchService) {}

    async indexPost(post: PostEntity) {
        return this.elasticsearchService.index({
            index: this.index,
            body: {
                id: post.id,
                title: post.title,
                body: post.body,
                author: post.author.id,
            },
        }) as unknown as Promise<PostSearchBody>;
    }

    async search(text: string) {
        const ddd = await this.elasticsearchService.search({
            index: this.index,
            body: {
                query: {
                    multi_match: {
                        query: text,
                        fields: ['title', 'body'],
                    },
                },
            },
        });
        console.log(ddd);
        const { hits } = ddd.body.hits;
        return hits.map((item: { _source: any }) => item._source);
    }

    async update(post: PostEntity) {
        const newBody: PostSearchBody = {
            id: post.id,
            title: post.title,
            body: post.body,
            author: post.author.id,
        };

        const script = Object.entries(newBody).reduce((result, [key, value]) => {
            return `${result} ctx._source.${key}='${value}';`;
        }, '');

        return this.elasticsearchService.updateByQuery({
            index: this.index,
            body: {
                query: {
                    match: {
                        id: post.id,
                    },
                },
                script,
            },
        }) as unknown as Promise<PostSearchBody>;
    }

    async remove(postId: string) {
        this.elasticsearchService.deleteByQuery({
            index: this.index,
            body: {
                query: {
                    match: {
                        id: postId,
                    },
                },
            },
        });
    }
}
