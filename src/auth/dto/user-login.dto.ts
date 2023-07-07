import { IsEmail, IsNotEmpty } from 'class-validator';
import { User } from '../../user/entities/user.entity';

export class UserLoginDTO {
  @IsNotEmpty()
  @IsEmail()
  username: string;

  password: string;
}

export class UserLoginResponseDTO {
  user: Partial<User>;
  accessToken: string;
  expiresIn: number;
}
