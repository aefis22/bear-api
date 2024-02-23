import { SetMetadata } from '@nestjs/common';

export const IS_ALLOWED = 'isAllowed';
export const Permission = () => SetMetadata(IS_ALLOWED, true);
