import { Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

import { QueryHook } from '@/modules/core/types';

import { CreateUserDto, UpdateUserDto } from '../dtos';
import { UserEntity } from '../entities';
import { UserRepository } from '../repositories';

/**
 * 用户管理服务
 *
 * @export
 * @class UserService
 */
@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async init() {
        const old = await this.findOneByCredential('pincman');
        if (!isNil(old)) {
            const admin = await this.update({
                id: old.id,
                username: 'pincman',
                password: '123456',
                email: 'pincman@qq.com',
            });
            return admin;
        }
        const admin = await this.create({
            username: 'pincman',
            password: '123456',
            email: 'pincman@qq.com',
        });
        return this.create(admin);
    }

    /**
     * 创建用户
     *
     * @param {CreateUserDto} data
     * @returns
     * @memberof UserService
     */
    async create(data: CreateUserDto) {
        const user = await this.userRepository.save(data);
        return this.findOneById(user.id);
    }

    /**
     * 更新用户
     *
     * @param {UpdateUserDto} data
     * @returns
     * @memberof UserService
     */
    async update(data: UpdateUserDto) {
        const user = await this.userRepository.save(data);
        return this.findOneById(user.id);
    }

    async delete(item: UserEntity) {
        return this.userRepository.remove(item);
    }

    /**
     * 根据用户用户凭证查询用户
     *
     * @param {string} credential
     * @param {QueryHook<UserEntity>} [callback]
     * @returns
     * @memberof UserService
     */
    async findOneByCredential(credential: string, callback?: QueryHook<UserEntity>) {
        let query = this.userRepository.buildBaseQuery();
        if (callback) {
            query = await callback(query);
        }
        return query
            .where('user.username = :credential', { credential })
            .orWhere('user.email = :credential', { credential })
            .getOne();
    }

    /**
     * 根据ID查询用户
     *
     * @param {string} id
     * @param {QueryHook<UserEntity>} [callback]
     * @returns
     * @memberof UserService
     */
    async findOneById(id: string, callback?: QueryHook<UserEntity>) {
        let query = this.userRepository.buildBaseQuery();
        if (callback) {
            query = await callback(query);
        }
        const user = await query.where('user.id = :id', { id }).getOne();
        if (!user) {
            throw new EntityNotFoundError(UserEntity, id);
        }
        return user;
    }

    /**
     * 根据对象条件查找用户,不存在则抛出异常
     *
     * @param {{ [key: string]: any }} condition
     * @param {QueryHook<UserEntity>} [callback]
     * @returns
     * @memberof UserService
     */
    async findOneByCondition(condition: { [key: string]: any }, callback?: QueryHook<UserEntity>) {
        let query = this.userRepository.buildBaseQuery();
        if (callback) {
            query = await callback(query);
        }
        const wheres = Object.fromEntries(
            Object.entries(condition).map(([key, value]) => [`user.${key}`, value]),
        );
        const user = query.where(wheres).getOne();
        if (!user) {
            throw new EntityNotFoundError(UserEntity, Object.keys(condition).join(','));
        }
        return user;
    }

    /**
     * @description 对查询结果进行分页
     * @param {IPaginationOptions} options
     */
    async paginate(options: IPaginationOptions) {
        const query = this.userRepository.buildBaseQuery();
        return paginate<UserEntity>(query, options);
    }
}
