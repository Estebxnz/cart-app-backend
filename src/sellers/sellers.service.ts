import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/common/enums/role.enum';
import { SellerDto } from './dto/seller.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SellersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  async createSeller(userId: number, { storeName }: CreateSellerDto) {
    const existsSeller = await this.getSellerByUserId(userId);

    if (existsSeller)
      throw new ConflictException('Este usuario ya es vendedor');

    const seller = await this.prismaService.sellers.create({
      data: {
        user_id: userId,
        storeName,
      },
      select: { id: true, storeName: true },
    });
    if (!seller) throw new BadRequestException('Error al crear vendedor');

    const storeNameResponse = seller.storeName ?? undefined;

    await this.rolesService.addRoleToUser(userId, Role.SELLER);

    const user = await this.userService.findById(userId);

    const { id, email, users_roles } = user;

    const roles = users_roles.map((roleData) => roleData.roles.name);

    const token = await this.authService.generateToken({
      id,
      email,
      roles,
    });

    return SellerDto.create(token, { storeName: storeNameResponse });
  }

  getSellerByUserId(userId: number) {
    return this.prismaService.sellers.findUnique({
      where: {
        user_id: userId,
      },
    });
  }
}
