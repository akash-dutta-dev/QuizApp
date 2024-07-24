export class LoginUserDto {
  readonly email: string;
  readonly password: string;
}
export class JwtUserDto {
  readonly email: string;
  readonly sub: number;
  readonly iat: number;
  readonly exp: number;
}
