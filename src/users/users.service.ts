import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ROLE_ADMIN, ROLE_USER } from './constants/roles';
import { WalletsService } from 'src/wallets/wallets.service';
import { RolesService } from 'src/roles/roles.service';
import { TransactionsService } from 'src/transactions/transactions.service';
// import { TransactionType } from 'generated/prisma/enums';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly walletService: WalletsService,
    private readonly rolesService: RolesService,
    private readonly transactionService: TransactionsService,
  ) {}

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
    if (createUserDto.username == 'admin') {
      await this.rolesService.createRoles(ROLE_ADMIN, ROLE_USER);
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

    const wallet = await this.walletService.create(userSaved.id);

    const rol = await this.rolesService.getRoleByName(ROLE_USER);

    const userRole = await this.prismaService.users_roles.create({
      data: {
        user_id: userSaved.id,
        role_id: rol.id,
      },
      include: {
        roles: { select: { name: true } },
      },
    });

    // const wallet = await this.walletService.deposit(userSaved.id, {
    //   amount: 1000000,
    // });

    // const transactionData = {
    //   wallet_id: wallet.id,
    //   type: TransactionType.DEPOSIT,
    //   amount: 1000000,
    // };

    // await this.transactionService.createTransaction(transactionData);

    return {
      ...userSaved,
      balance: wallet.balance,
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
        wallet: {
          select: {
            balance: true,
          },
        },
      },
    });
  }
}
