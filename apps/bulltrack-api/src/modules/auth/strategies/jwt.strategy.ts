import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../../users/application/users.service';
import { ConfigService } from '@nestjs/config';
import { AUTH_COOKIE_NAME } from '../../../config/constants';

export type JwtPayload = { sub: string; email: string };

function jwtFromCookieOrHeader(cookieName: string) {
  return (req: Request) => {
    const token = req?.cookies?.[cookieName];
    if (token) return token;
    return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: jwtFromCookieOrHeader(AUTH_COOKIE_NAME),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
