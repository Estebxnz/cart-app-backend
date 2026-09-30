import { createParamDecorator } from '@nestjs/common';

export const CurrenUser = createParamDecorator(
  (
    data: keyof { id: number; email: string; roles: string[] } | undefined,
    ctx,
  ) => {
    const user = ctx.switchToHttp().getRequest().user;
    if (!data) {
      return user;
    }

    return user[data] || user;
  },
);
