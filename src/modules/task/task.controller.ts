// src/modules/task/task.controller.ts
import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { TaskService } from "./task.service";
import { plainToInstance } from "class-transformer";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { UpdateTaskDTO } from "./dto/update-task.dto";

@injectable()
export class TaskController {
  constructor(private taskService: TaskService) {}

  getTasksByProject = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const projectId = req.params.projectId;
      const authUserId = res.locals.user.id;
      const result = await this.taskService.getTasksByProject(
        projectId,
        authUserId
      );
      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  };

  createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = req.params.projectId;
      const authUserId = res.locals.user.id;
      const body = plainToInstance(CreateTaskDTO, req.body);
      const result = await this.taskService.createTask(
        projectId,
        authUserId,
        body
      );
      res.status(201).send(result);
    } catch (err) {
      next(err);
    }
  };

  getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.taskService.getTaskById(
        req.params.taskId,
        res.locals.user.id
      );
      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  };

  updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = req.params.taskId;
      const authUserId = res.locals.user.id;
      const body = plainToInstance(UpdateTaskDTO, req.body);
      const result = await this.taskService.updateTask(
        taskId,
        authUserId,
        body
      );
      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  };

  deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = req.params.taskId;
      const authUserId = res.locals.user.id;
      const result = await this.taskService.deleteTask(taskId, authUserId);
      res.status(200).send(result);
    } catch (err) {
      next(err);
    }
  };
}
