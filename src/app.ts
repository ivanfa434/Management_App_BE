import cors from "cors";
import express, { Express, json } from "express";
import "reflect-metadata";
import { container } from "tsyringe";
import { PORT } from "./config";
import { errorMiddleware } from "./middlewares/error.middleware";
import { AuthRouter } from "./modules/auth/auth.router";
import { UserRouter } from "./modules/user/user.router";
import { ProjectRouter } from "./modules/project/project.router";

export class App {
  public app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure() {
    this.app.use(cors());
    this.app.use(json());
  }

  private routes() {
    const authRouter = container.resolve(AuthRouter);
    const userRouter = container.resolve(UserRouter);
    const projectRouter = container.resolve(ProjectRouter);

    this.app.use("/auth", authRouter.getRouter());
    this.app.use("/users", userRouter.getRouter());
    this.app.use("/projects", projectRouter.getRouter());
  }

  private handleError() {
    this.app.use(errorMiddleware);
  }

  public start() {
    this.app.listen(PORT, () => {
      console.log(`SERVER RUNNING ON PORT: ${PORT}`);
    });
  }
}
