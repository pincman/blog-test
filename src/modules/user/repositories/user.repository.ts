import { Repository } from 'typeorm';

import { CustomRepository } from '@/modules/core/decorators';

import { UserEntity } from '../entities';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
    /**
     * 构建基础Query
     *
     * @returns
     * @memberof UserRepository
     */
    buildBaseQuery() {
        return this.createQueryBuilder('user').orderBy('user.createdAt', 'DESC');
    }
}
