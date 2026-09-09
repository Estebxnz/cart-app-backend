import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    console.log('informacion desde authguard');
    console.log('Error:', err);
    console.log('User:', user);
    console.log('Info:', info);
    return super.handleRequest(err, user, info, context);
  }
}
