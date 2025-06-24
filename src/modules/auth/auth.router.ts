import { Router } from "express";
import { injectable } from "tsyringe";
import { validateBody } from "../../middlewares/validation.middleware";
import { AuthController } from "./auth.controller";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { RegisterDTO } from "./dto/register.dto";
import { LoginDTO } from "./dto/login.dto";

@injectable()
export class AuthRouter {
  private router: Router;
  private authController: AuthController;
  private jwtMiddleware: JwtMiddleware;

  constructor(AuthController: AuthController, JwtMiddleware: JwtMiddleware) {
    this.router = Router();
    this.authController = AuthController;
    this.jwtMiddleware = JwtMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.post(
      "/register",
      validateBody(RegisterDTO),
      this.authController.register
    );

    this.router.post(
      "/login",
      validateBody(LoginDTO),
      this.authController.login
    );
  };

  getRouter() {
    return this.router;
  }
}
