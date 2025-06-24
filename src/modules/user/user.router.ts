import { Router } from "express";
import { injectable } from "tsyringe";
import { UserController } from "./user.controller";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { JWT_SECRET_KEY } from "../../config";

@injectable()
export class UserRouter {
  private router: Router;
  private userController: UserController;
  private jwtMiddleware: JwtMiddleware;

  constructor(UserController: UserController, JwtMiddleware: JwtMiddleware) {
    this.router = Router();
    this.userController = UserController;
    this.jwtMiddleware = JwtMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    // Get all users (kecuali diri sendiri)
    this.router.get(
      "/",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      this.userController.getUsers
    );

    // Get profile (me)
    this.router.get(
      "/me",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      this.userController.getUser
    );

  };

  getRouter() {
    return this.router;
  }
}
