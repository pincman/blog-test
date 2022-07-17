import { SetMetadata } from '@nestjs/common';
import { ObjectType } from 'typeorm';

import { CUSTOM_REPOSITORY_DATAMETA } from '../constants';

export const CustomRepository = <T>(entity: ObjectType<T>): ClassDecorator =>
    SetMetadata(CUSTOM_REPOSITORY_DATAMETA, entity);
