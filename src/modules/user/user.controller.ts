import { injectable } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { UserService } from "./user.service";
import { GetUsersDTO } from "./dto/get-users.dto";

@injectable()
export class UserController {
  private userService: UserService;

  constructor(UserService: UserService) {
    this.userService = UserService;
  }

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = plainToInstance(GetUsersDTO, req.query);
      const authUserId = res.locals.user.id;
      const result = await this.userService.getUsers(authUserId, query);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUserId = res.locals.user.id;
      const result = await this.userService.getUser(authUserId);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}
