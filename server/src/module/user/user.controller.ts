import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from '../auth/auth.service';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { JwtUserDto } from './dto/jwt-user.dto';
import { OtpDto } from './dto/otp.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.userService.register(createUserDto);
    const { access_token } = await this.authService.login(user);
    res.cookie('jwt', access_token, { httpOnly: true });
    res.status(HttpStatus.CREATED).json(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.userService.login(loginUserDto);
    const { access_token } = await this.authService.login(user);
    res.cookie('jwt', access_token, {
      httpOnly: true,
    });

    res.status(HttpStatus.OK).json(user);
  }

  @Post('guestLogin')
  @HttpCode(HttpStatus.OK)
  async guestLogin(@Res() res: Response): Promise<void> {
    const user = await this.userService.guestLogin();
    const { access_token } = await this.authService.login(user);
    res.cookie('jwt', access_token, {
      httpOnly: true,
    });

    res.status(HttpStatus.OK).json(user);
  }

  @Get('isLoggedIn')
  @HttpCode(HttpStatus.OK)
  async isLoggedIn(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.authService.verifyTokenAndSetUser(req);
    const user = await this.userService.isLoggedIn(req.user as JwtUserDto);
    res.status(HttpStatus.OK).json(user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.authService.verifyTokenAndSetUser(req);
    res.clearCookie('jwt');
    res.status(HttpStatus.OK).send();
  }

  @Post('otpVerify')
  async otpVerify(
    @Body() otp: OtpDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.authService.verifyTokenAndSetUser(req);
    const user = await this.userService.otpVerify(req.user as JwtUserDto, otp);
    res.status(HttpStatus.OK).json(user);
  }

  @Get('checkUser')
  async checkUser(@Req() req: Request) {
    await this.authService.verifyTokenAndSetUser(req);
    console.log('check', req.user);
  }
  //{ email: 'abcde@gmail.com', sub: 3, iat: 1721589971, exp: 1729365971 }
}
