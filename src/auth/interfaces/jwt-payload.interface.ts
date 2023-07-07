export interface JwtPayload {
  email: string;
}

export class JwtResponse {
  expiresIn: number;
  token: string;
  userId: string;
}
