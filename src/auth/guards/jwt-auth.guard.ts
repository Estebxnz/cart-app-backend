import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common';

export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (info?.name == 'Error') {
      throw new UnauthorizedException('Sesion requerida');
    }

    if (!user) {
      throw new UnauthorizedException('Sesion invalida o expirada');
    }

    return user;
  }
}
