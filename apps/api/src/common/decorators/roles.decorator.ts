import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@opnmrt/shared';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
