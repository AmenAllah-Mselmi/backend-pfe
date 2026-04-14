import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request) || this.extractTokenFromCookie(request);
    
    if (!token) {
      throw new UnauthorizedException('Authentication token is missing');
    }
    
    try {
      // In a real app we'd use process.env.JWT_SECRET or ConfigService. 
      // Assuming JwtModule is registering secretly globally.
      // But if jwtService.verifyAsync requires secret here:
      const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET || 'default_secret'
      });
      // Attach the payload to the request object
      // Payload contains { sub, email, role }
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    if (request.cookies && request.cookies.token) {
      return request.cookies.token;
    }
    return undefined;
  }
}
