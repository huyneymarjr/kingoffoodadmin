import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Res,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { CodeAuthDto, ForgotPasswordAuthDto, RetryActiveDto, RetryPasswordDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import {
  User as UserSchema,
  UserDocument,
} from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private rolesService: RolesService,
    private readonly mailerService: MailerService,
    @InjectModel(UserSchema.name)
    private userModel: Model<UserDocument>,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 60)
  @ApiBody({ type: UserLoginDto })
  @Post('/login')
  @ResponseMessage('User Login')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @ResponseMessage('Register a new user')
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @ResponseMessage('Get user information')
  @Get('/account')
  async handleGetAccount(@User() user: IUser) {
    const temp = (await this.rolesService.findOne(user.role._id)) as any;
    user.permissions = temp.permissions;
    const userDetails = await this.userModel
      .findById(user._id)
      .select('address phoneNumber name email')
      .exec();

    return {
      user: {
        ...user,
        name: userDetails.name,
        email: userDetails.email,
        address: userDetails.address,
        phoneNumber: userDetails.phoneNumber,
      },
    };
  }

  @Public()
  @ResponseMessage('Get User by refresh token')
  @Get('/refresh')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.processNewToken(refreshToken, response);
  }

  @ResponseMessage('Logout User')
  @Post('/logout')
  handleLogout(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser,
  ) {
    return this.authService.logout(response, user);
  }

  @Post('check-code')
  @Public()
  checkCode(@Body() registerDto: CodeAuthDto) {
    return this.authService.checkCode(registerDto);
  }

  @Post('retry-active')
  @Public()
  retryActive(@Body() data: RetryActiveDto) {
    return this.authService.retryActive(data);
  }

  @Post('retry-password')
  @Public()
  retryPassword(@Body() data: RetryPasswordDto) {
    return this.authService.retryPassword(data);
  }

  @Post('forgot-password')
  @Public()
  forgotPassword(@Body() data: ForgotPasswordAuthDto) {
    return this.authService.forgotPassword(data);
  }

  // @Get('mail')
  // @Public()
  // testMail() {
  //     this.mailerService
  //     .sendMail({
  //         to: 'huy@gmail.com', // list of receivers
  //         subject: 'Testing Nest MailerModule ✔', // Subject line
  //         text: 'welcome', // plaintext body
  //         template: "register",
  //         context: {
  //         name: "Neymar",
  //         activationCode: 123456789
  //         }
  //     })
  //     return "ok";
  // }
}
