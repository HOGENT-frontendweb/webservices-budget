import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '../roles';

@Injectable()
export class CheckUserAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new UnauthorizedException('You need to be signed in');
    }

    const { id: userId, roles } = request.user;
    const id = request.params.id;

    if (id !== 'me' && id !== String(userId) && !roles.includes(Role.ADMIN)) {
      throw new NotFoundException('No user with this id exists');
    }

    return true;
  }
}
