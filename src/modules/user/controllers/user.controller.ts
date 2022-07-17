import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    SerializeOptions,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

import { CreateUserDto, QueryUserDto, UpdateUserDto } from '../dtos';
import { UserEntity } from '../entities';
import { UserService } from '../services';

/**
 * 用户管理控制器
 *
 * @export
 * @class UserController
 */

@ApiTags('用户管理')
@ApiBearerAuth()
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @SerializeOptions({
        groups: ['user-list'],
    })
    async index(@Query() { page, limit }: QueryUserDto) {
        return this.userService.paginate({ page, limit });
    }

    @Get(':id')
    @SerializeOptions({
        groups: ['user-item'],
    })
    show(
        @Param('id', new ParseUUIDPipe())
        user: UserEntity,
    ): Promise<UserEntity> {
        return this.userService.findOneById(user.id);
    }

    @Post()
    @SerializeOptions({
        groups: ['user-item'],
    })
    async create(
        @Body()
        createUserDto: CreateUserDto,
    ): Promise<UserEntity> {
        return this.userService.create(createUserDto);
    }

    @Patch()
    @SerializeOptions({
        groups: ['user-item'],
    })
    async update(
        @Body()
        updateUserDto: UpdateUserDto,
    ): Promise<UserEntity> {
        return this.userService.update(updateUserDto);
    }

    @ApiParam({ name: 'user', type: String })
    @Delete(':user')
    @SerializeOptions({ groups: ['user-item'] })
    async destroy(
        @Param('user', new ParseUUIDPipe())
        user: UserEntity,
    ) {
        return this.userService.delete(user);
    }
}
