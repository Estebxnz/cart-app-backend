import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ) {
    console.log('Error:', err);
    console.log('User:', user);
    console.log('Info:', info);
    console.log('Context:', context);
    console.log('Status:', status);
    return super.handleRequest(err, user, info, context, status);
  }
}
