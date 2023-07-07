import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDTO } from './dto/user-login.dto';
import { Public } from './guards/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post()
  async login(@Body() user: UserLoginDTO) {
    return await this.authService.validateUserByPassword(user);
  }

  @Post('refresh-access-token')
  async refreshAccessToken(@Body() body: { accessToken: string }) {
    return await this.authService.refreshToken(body.accessToken);
  }
}
