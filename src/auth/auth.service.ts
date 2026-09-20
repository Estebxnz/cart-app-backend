import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerAuthDto: RegisterAuthDto) {
    const user = await this.usersService.create(registerAuthDto);

    return await this.login({
      username: user.username,
      password: registerAuthDto.password,
    });
  }

  async login(loginAuthDto: LoginAuthDto) {
    console.log(loginAuthDto);
    const user = await this.usersService.findOneByUsername(
      loginAuthDto.username,
    );

    if (!user) {
      throw new NotFoundException('Este usuario no existe');
    }

    const isMatch = await bcrypt.compare(loginAuthDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const { id, username, email, users_roles, wallet } = user;

    const roles = users_roles.map((data) => data.roles.name.slice(5));
    console.log('Roles del usuario:', roles);

    const token = await this.jwtService.signAsync({
      id,
      username,
      roles,
    });

    return {
      user: {
        id,
        username,
        email,
        balance: wallet?.balance,
      },
      token,
    };
  }
}
