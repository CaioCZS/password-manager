import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up users' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'E-mail already in use',
  })
  @Post('/sign-up')
  async signUp(@Body() body: SignUpDto) {
    await this.authService.signUp(body);
    return { message: 'User created' };
  }
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'E-mail or password is wrong',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'If e-mail and password corrects, returns an jwt token',
  })
  @ApiOperation({ summary: 'Sign in users' })
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }
}
