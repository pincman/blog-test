import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';

import { PostEntity } from '../entities';

import { SanitizeService } from '../services/sanitize.service';

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<PostEntity> {
    constructor(dataSource: DataSource, protected sanitizeService: SanitizeService) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return PostEntity;
    }

    async afterLoad(entity: PostEntity) {
        entity.title = this.sanitizeService.sanitize(entity.title, {
            allowedTags: [],
            allowedAttributes: {},
        });
        entity.body = this.sanitizeService.sanitize(entity.body);
    }
}
