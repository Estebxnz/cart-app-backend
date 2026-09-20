import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}

  createRoles(...rolesName: string[]) {
    const roles = rolesName.map((roleName) => {
      return {
        name: roleName,
      };
    });

    console.log(roles);

    return this.prismaService.roles.createMany({
      data: roles,
    });
  }

  createRol(name: string) {
    return this.prismaService.roles.create({
      data: {
        name,
      },
    });
  }

  async getRoleByName(name: string) {
    const rol = await this.prismaService.roles.findUnique({
      where: {
        name,
      },
    });
    if (!rol) {
      throw new NotFoundException('Rol no disponible');
    }
    return rol;
  }
}
