import { Router } from "express";
import { injectable } from "tsyringe";
import { TaskController } from "./task.controller";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { JWT_SECRET_KEY } from "../../config";
import { validateBody } from "../../middlewares/validation.middleware";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { UpdateTaskDTO } from "./dto/update-task.dto";

@injectable()
export class TaskRouter {
  private router: Router;
  private taskController: TaskController;
  private jwtMiddleware: JwtMiddleware;

  constructor(TaskController: TaskController, JwtMiddleware: JwtMiddleware) {
    this.router = Router();
    this.taskController = TaskController;
    this.jwtMiddleware = JwtMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(
      "/projects/:projectId/tasks",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      this.taskController.getTasksByProject
    );

    this.router.post(
      "/projects/:projectId/tasks",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      validateBody(CreateTaskDTO),
      this.taskController.createTask
    );

    this.router.get(
      "/tasks/:taskId",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      this.taskController.getTaskById
    );

    this.router.put(
      "/tasks/:taskId",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      validateBody(UpdateTaskDTO),
      this.taskController.updateTask
    );

    this.router.delete(
      "/tasks/:taskId",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      this.taskController.deleteTask
    );
  };

  public getRouter() {
    return this.router;
  }
}
