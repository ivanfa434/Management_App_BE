import { Router } from "express";
import { injectable } from "tsyringe";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { validateBody } from "../../middlewares/validation.middleware";
import { AuthController } from "./auth.controller";
import { LoginDTO } from "./dto/login.dto";
import { RegisterDTO } from "./dto/register.dto";

@injectable()
export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor(AuthController: AuthController, JwtMiddleware: JwtMiddleware) {
    this.router = Router();
    this.authController = AuthController;
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
