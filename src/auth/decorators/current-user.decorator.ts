import { createParamDecorator } from '@nestjs/common';
import { IJwtPayload } from '../../../dist/src/auth/interfaces/jwt-payload.interface';

export const CurrenUser = createParamDecorator(
  (data: keyof IJwtPayload | undefined, ctx) => {
    const user = ctx.switchToHttp().getRequest().user;
    if (!data) {
      return user;
    }

    return user[data] || user;
  },
);
