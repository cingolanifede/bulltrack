import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import {
  AUTH_COOKIE_NAME,
  COOKIE_MAX_AGE_DAYS,
  IS_PRODUCTION,
  REFRESH_AUTH_COOKIE_NAME,
  REFRESH_COOKIE_MAX_AGE_DAYS,
} from '../../config/constants';

const cookieOptions = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: 'lax' as const,
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, user } =
      await this.authService.login(dto);
    res.cookie(AUTH_COOKIE_NAME, access_token, {
      ...cookieOptions,
      maxAge: COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
    });
    res.cookie(REFRESH_AUTH_COOKIE_NAME, refresh_token, {
      ...cookieOptions,
      maxAge: REFRESH_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
    });
    return { user };
  }

  @Post('refresh')
  @Public()
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken =
      req.cookies?.[REFRESH_AUTH_COOKIE_NAME] ??
      (req.body?.refresh_token as string | undefined);
    if (!refreshToken?.trim()) {
      throw new UnauthorizedException('Refresh token required');
    }
    const { access_token, refresh_token, user } =
      await this.authService.refresh(refreshToken.trim());
    res.cookie(AUTH_COOKIE_NAME, access_token, {
      ...cookieOptions,
      maxAge: COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
    });
    res.cookie(REFRESH_AUTH_COOKIE_NAME, refresh_token, {
      ...cookieOptions,
      maxAge: REFRESH_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
    });
    return { user };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: User) {
    return { user: { id: user.id, email: user.email } };
  }

  @Post('logout')
  @Public()
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie(AUTH_COOKIE_NAME, '', { ...cookieOptions, maxAge: 0 });
    res.cookie(REFRESH_AUTH_COOKIE_NAME, '', { ...cookieOptions, maxAge: 0 });
    return { success: true };
  }
}
