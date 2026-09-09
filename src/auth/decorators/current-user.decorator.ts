import { createParamDecorator } from '@nestjs/common';

export const CurrenUser = createParamDecorator(
  (
    data: keyof { id: number; username: string; roles: [] } | undefined,
    ctx,
  ) => {
    const user = ctx.switchToHttp().getRequest().user;
    if (!data) {
      return user;
    }

    return user[data] || user;
  },
);
