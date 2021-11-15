import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { ExpressRequestInterface } from "src/types/expressRequestInterface";
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const request = ctx.switchToHttp().getRequest<ExpressRequestInterface>();
    if (request.user) {
      return true;
    }

    throw new HttpException("Not authorized", HttpStatus.UNAUTHORIZED);
  }
}
