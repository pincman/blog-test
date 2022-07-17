import crypto from 'crypto';

import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
} from 'typeorm';

import { encrypt } from '@/modules/core/helpers';

import { UserEntity } from '../entities/user.entity';

/**
 * @description 用户模型监听器
 * @export
 * @class UserSubscriber
 * @implements {EntitySubscriberInterface<UserEntity>}
 */
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
    constructor(dataSource: DataSource) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return UserEntity;
    }

    /**
     * 生成不重复的随机用户名
     *
     * @protected
     * @param {InsertEvent<UserEntity>} event
     * @return {*}  {Promise<string>}
     * @memberof UserSubscriber
     */
    protected async generateUserName(event: InsertEvent<UserEntity>): Promise<string> {
        const username = `user_${crypto.randomBytes(4).toString('hex').slice(0, 8)}`;
        const user = await event.manager.findOne(UserEntity, {
            where: { username },
        });
        return !user ? username : this.generateUserName(event);
    }

    /**
     * 自动生成唯一用户名和密码
     *
     * @param {InsertEvent<UserEntity>} event
     * @memberof UserSubscriber
     */
    async beforeInsert(event: InsertEvent<UserEntity>) {
        // 自动生成唯一用户名
        if (!event.entity.username) {
            event.entity.username = await this.generateUserName(event);
        }
        // 自动生成密码
        if (!event.entity.password) {
            event.entity.password = crypto.randomBytes(11).toString('hex').slice(0, 22);
        }

        // 自动加密密码
        event.entity.password = encrypt(event.entity.password);
    }

    /**
     * 当密码更改时加密密码
     *
     * @param {UpdateEvent<UserEntity>} event
     * @memberof UserSubscriber
     */
    async beforeUpdate(event: UpdateEvent<UserEntity>) {
        if (this.isUpdated('password', event)) {
            event.entity.password = encrypt(event.entity.password);
        }
    }

    protected isUpdated<E>(cloumn: keyof E, event: UpdateEvent<E>): any {
        return event.updatedColumns.find((item) => item.propertyName === cloumn);
    }
}
