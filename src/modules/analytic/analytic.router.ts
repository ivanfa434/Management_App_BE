import { injectable } from "tsyringe";
import { AnalyticController } from "./analytic.controller";
import { Router } from "express";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { JWT_SECRET_KEY } from "../../config";

@injectable()
export class AnalyticRouter {
  private router: Router;
  private analyticController: AnalyticController;
  private jwtMiddleware: JwtMiddleware;

  constructor(
    AnalyticController: AnalyticController,
    JwtMiddleware: JwtMiddleware
  ) {
    this.router = Router();
    this.analyticController = AnalyticController;
    this.jwtMiddleware = JwtMiddleware;
    this.initializeRoutes();
  }
  private initializeRoutes = () => {
    this.router.get(
      "/:id/analytics",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      this.analyticController.getTaskAnalytics
    );
  };
  getRouter() {
    return this.router;
  }
}
