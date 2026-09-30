import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { Role } from 'src/common/enums/role.enum';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}

  createRoles(tx?: Prisma.TransactionClient, ...rolesName: string[]) {
    const db = tx ?? this.prismaService;
    const roles = rolesName.map((roleName) => {
      return {
        name: roleName,
      };
    });

    return db.roles.createMany({
      data: roles,
    });
  }

  createRol(name: string, tx?: Prisma.TransactionClient) {
    const db = tx ?? this.prismaService;
    return db.roles.create({
      data: {
        name,
      },
    });
  }

  async getRoleByName(name: string, tx?: Prisma.TransactionClient) {
    const db = tx ?? this.prismaService;
    const rol = await db.roles.findUnique({
      where: {
        name,
      },
    });
    if (!rol) throw new NotFoundException('Rol no disponible');

    return rol;
  }

  async addRoleToUser(userId: number, roleName: Role) {
    const role = await this.getRoleByName(roleName);
    return this.prismaService.users_roles.create({
      data: {
        user_id: userId,
        role_id: role.id,
      },
      include: {
        roles: true,
      },
    });
  }
}
