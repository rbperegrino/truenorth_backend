import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserLoginDTO, UserLoginResponseDTO } from './dto/user-login.dto';
import { User, UserStatusEnum } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUserByPassword(
    loginAttempt: UserLoginDTO,
  ): Promise<UserLoginResponseDTO> {
    // This will be used for the initial login
    let userToAttempt: User;

    try {
      userToAttempt = await this.usersService.findOneByUsername(
        loginAttempt.username,
      );
    } catch (error) {
      throw new UnauthorizedException();
    }

    const checkPassword = userToAttempt.checkPassword(loginAttempt.password);

    delete userToAttempt.password;

    if (userToAttempt.status === UserStatusEnum.ACTIVE && checkPassword) {
      return this.createJwtPayload(userToAttempt);
    } else {
      throw new UnauthorizedException();
    }
  }

  async refreshToken(token: string) {
    const decode = this.jwtService.decode(token, { json: true });

    return this.validateUserByJwt({ email: decode['email'] });
  }

  async validateUserByJwt(payload: JwtPayload) {
    // This will be used when the user has already logged in and has a JWT
    const user = await this.usersService.findOneByUsername(payload.email);

    if (user) {
      return this.createJwtPayload(user);
    } else {
      throw new UnauthorizedException();
    }
  }

  async createJwtPayload(user): Promise<UserLoginResponseDTO> {
    const data: JwtPayload = {
      email: user.email,
    };

    const jwt = this.jwtService.sign(data);

    return {
      user,
      accessToken: jwt,
      expiresIn: 3600,
    };
  }
}
