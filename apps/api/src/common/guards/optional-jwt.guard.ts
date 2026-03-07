import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * OptionalJwtGuard — Does NOT throw on missing / invalid tokens.
 * If a valid JWT is present, req.user is populated normally.
 * If no token or invalid token, req.user is undefined (guest mode).
 */
@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, _info: any, _context: ExecutionContext) {
        // Return user if authenticated, or undefined if not — never throw
        return user || undefined;
    }
}
