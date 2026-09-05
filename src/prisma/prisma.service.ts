import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    const adapter = new PrismaPg({
      connectionString: connectionString!,
    });

    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      new Logger('PrismaService').log('Base de datos conectada correctamente');
    } catch (error) {
      new Logger('PrismaService').error(
        'Error conectando a la base de datos:',
        error,
      );
    }
  }
}
