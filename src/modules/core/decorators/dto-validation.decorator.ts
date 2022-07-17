import { Paramtype, SetMetadata } from '@nestjs/common';
import { ClassTransformOptions } from '@nestjs/common/interfaces/external/class-transform-options.interface';
import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';

import { DTO_VALIDATION_OPTIONS } from '../constants';

export const DtoValidation = (
    options?: ValidatorOptions & {
        transformOptions?: ClassTransformOptions;
    } & { type?: Paramtype },
) => SetMetadata(DTO_VALIDATION_OPTIONS, options ?? {});
