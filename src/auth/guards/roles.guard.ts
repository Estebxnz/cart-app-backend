import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requeriedRoles = this.reflector.get('roles', context.getHandler());

    if (!requeriedRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const hasRole = requeriedRoles.some((role) => user.roles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('Permiso denegado');
    }
    return hasRole;
  }
}
