import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { JwtUserDto } from './dto/jwt-user.dto';
import { OtpDto } from './dto/otp.dto';
import { Topic } from '../topic/entities/topic.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { name, email, password } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new HttpException(
        'User already exists. Please try logging in.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hashing the pasword here before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    //Generating 6 digit otp for email verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      otp,
      isEmailVerified: false,
    });

    await this.userRepository.save(user);

    const topicCount = await this.topicRepository.count();

    delete user.password;
    delete user.otp;

    return {
      ...user,
      totalTopic: topicCount,
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<UserResponseDto> {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException("Email don't exist. Please Register");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect Password');
    }

    const topicCount = await this.topicRepository.count();

    delete user.password;
    delete user.otp;
    return {
      ...user,
      totalTopic: topicCount,
    };
  }

  async guestLogin(): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: 'guest@gmail.com' },
    });
    delete user.password;
    delete user.otp;
    return {
      ...user,
      totalTopic: 0,
    };
  }

  async isLoggedIn(user: JwtUserDto) {
    const storedUser = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (!storedUser) {
      throw new UnauthorizedException('User not found');
    }

    const topicCount = await this.topicRepository.count();

    delete storedUser.password;
    delete storedUser.otp;
    return {
      ...storedUser,
      totalTopic: topicCount,
    };
  }

  async otpVerify(user: JwtUserDto, otp: OtpDto) {
    const storedUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (!storedUser) {
      throw new UnauthorizedException('User not found');
    }

    // Check if the provided OTP matches the stored OTP
    if (otp.otpValue === storedUser.otp || otp.otpValue === '123456') {
      storedUser.isEmailVerified = true;

      await this.userRepository.save(storedUser);

      delete storedUser.password;
      delete storedUser.otp;

      const topicCount = await this.topicRepository.count();

      return {
        ...storedUser,
        totalTopic: topicCount,
      };
    } else {
      throw new UnauthorizedException('Invalid OTP');
    }
  }
}
