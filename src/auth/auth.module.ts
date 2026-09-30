import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt-strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret:
        'pkSgqEooOkn1isICra5MfUlVQLg6MRLVnQV8bjvcuWrVnillkJLntJNJ-2ojNYNtC0Qfahq9KgBORSj3RuJZNX',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
