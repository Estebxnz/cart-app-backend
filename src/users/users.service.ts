import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ROLE_USER } from './constants/roles';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.findOneByUsernameOrEmail(
      createUserDto.username,
      createUserDto.email,
    );

    if (user?.username === createUserDto.username) {
      throw new ConflictException('Username already exists');
    }
    if (user?.email === createUserDto.email) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const userSaved = await this.prismaService.users.create({
      data: { ...createUserDto, password: hashedPassword },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    await this.prismaService.cart.create({
      data: {
        user_id: userSaved.id,
      },
    });

    const userRole = await this.prismaService.users_roles.create({
      data: {
        user_id: userSaved.id,
        role_id: ROLE_USER,
      },
      include: {
        roles: { select: { name: true } },
      },
    });

    return {
      ...userSaved,
      roles: [userRole.roles],
    };
  }

  findOneByUsernameOrEmail(username: string, email: string) {
    return this.prismaService.users.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
  }

  findOneByUsername(username: string) {
    return this.prismaService.users.findUnique({
      where: {
        username,
      },
      include: {
        users_roles: {
          include: {
            roles: { select: { name: true } },
          },
        },
      },
    });
  }
}
