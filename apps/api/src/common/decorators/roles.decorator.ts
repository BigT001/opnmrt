import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@opnmart/shared';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
