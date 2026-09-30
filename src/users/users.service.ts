import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { WalletsService } from 'src/wallets/wallets.service';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/common/enums/role.enum';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly walletService: WalletsService,
    private readonly rolesService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.prismaService.$transaction(async (tx) => {
      const user = await this.exitsByEmail(createUserDto.email, tx);

      if (user) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const userSaved = await tx.users.create({
        data: { ...createUserDto, password: hashedPassword },
        select: {
          id: true,
          name: true,
          lastname: true,
          email: true,
        },
      });

      await tx.cart.create({
        data: {
          user_id: userSaved.id,
        },
      });

      const wallet = await this.walletService.create(userSaved.id, tx);

      const rol = await this.rolesService.getRoleByName(Role.USER, tx);

      const userRole = await tx.users_roles.create({
        data: {
          user_id: userSaved.id,
          role_id: rol.id,
        },
        include: {
          roles: { select: { name: true } },
        },
      });

      await this.walletService.deposit(
        userSaved.id,
        {
          amount: 1000000,
        },
        tx,
      );

      return {
        ...userSaved,
        balance: wallet.balance,
        roles: [userRole.roles],
      };
    });
  }

  exitsByEmail(email: string, tx?: Prisma.TransactionClient) {
    const db = tx ?? this.prismaService;
    return db.users.findFirst({
      where: { email },
    });
  }

  findOneByEmail(email: string) {
    return this.prismaService.users.findUnique({
      where: {
        email,
      },
      include: {
        users_roles: {
          include: {
            roles: { select: { name: true } },
          },
        },
        wallet: {
          select: {
            balance: true,
          },
        },
      },
    });
  }

  async findById(userId: number) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id: userId,
      },
      include: {
        users_roles: {
          include: {
            roles: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('Este usuario no existe');
    return user;
  }
}
