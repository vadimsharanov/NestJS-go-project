import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ExpressRequestInterface } from "src/types/expressRequestInterface";
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "src/config";
import { UserService } from "../user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const token = req.headers.authorization.split(" ")[1];
    console.log("token", token);

    try {
      const decode = verify(token, JWT_SECRET);
      console.log("decode", decode);
      const user = await this.userService.findByID(decode.id);
      req.user = user;
      next();
    } catch (err) {
      req.user = null;
      console.log(err);
      next();
    }
  }
}
