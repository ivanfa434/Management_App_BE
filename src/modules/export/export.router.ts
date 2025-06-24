import { injectable } from "tsyringe";
import { ExportController } from "./export.controller";
import { Router } from "express";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { JWT_SECRET_KEY } from "../../config";

@injectable()
export class ExportClass {
  private router: Router;
  private exportController: ExportController;
  private jwtMiddleware: JwtMiddleware;

  constructor(
    ExportController: ExportController,
    JwtMiddleware: JwtMiddleware
  ) {
    this.router = Router();
    this.exportController = ExportController;
    this.jwtMiddleware = JwtMiddleware;
    this.initializeRoutes();
  }
  private initializeRoutes = () => {
    this.router.get(
      "/:id/export",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      this.exportController.exportProject
    );
  };
  getRouter() {
    return this.router;
  }
}
