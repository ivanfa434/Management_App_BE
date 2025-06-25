import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { ProjectService } from "./project.service";
import { plainToInstance } from "class-transformer";
import { CreateProjectDTO } from "./dto/create-project.dto";
import { InviteMemberDTO } from "./dto/invite-mamber.dto";

@injectable()
export class ProjectController {
  private projectService: ProjectService;

  constructor(ProjectService: ProjectService) {
    this.projectService = ProjectService;
  }

  getUserProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUserId = res.locals.user.id;
      const result = await this.projectService.getAllUserProjects(authUserId);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
  createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = plainToInstance(CreateProjectDTO, req.body);
      const authUserId = res.locals.user.id;
      const result = await this.projectService.createProject(authUserId, body);
      res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  };
  getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUserId = res.locals.user.id;
      const projectId = req.params.id;
      const result = await this.projectService.getProjectById(
        projectId,
        authUserId
      );
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
  updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUserId = res.locals.user.id;
      const projectId = req.params.id;
      const result = await this.projectService.updateProject(
        projectId,
        req.body,
        authUserId
      );
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
  deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = req.params.id;
      const authUserId = res.locals.user.id;
      const result = await this.projectService.deleteProject(
        projectId,
        authUserId
      );
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  inviteMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = req.params.id;
      const authUserId = res.locals.user.id;
      const body = plainToInstance(InviteMemberDTO, req.body);
      const result = await this.projectService.inviteMember(
        projectId,
        authUserId,
        body
      );
      res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  };

  getProjectMembers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const projectId = req.params.id;
      const authUserId = res.locals.user.id;
      const result = await this.projectService.getProjectMembers(
        projectId,
        authUserId
      );
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  removeProjectMember = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const projectId = req.params.id;
      const userId = req.params.userId;
      const authUserId = res.locals.user.id;
      const result = await this.projectService.removeProjectMember(
        projectId,
        userId,
        authUserId
      );
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
  getTaskAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authUserId = res.locals.user.id;
      const projectId = req.params.id;
      const result = await this.projectService.getTaskAnalytics(
        projectId,
        authUserId
      );
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  exportProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = req.params.id;
      const authUserId = res.locals.user.id;
      const data = await this.projectService.getProjectExport(
        projectId,
        authUserId
      );

      const fileName = `project-${data.id}.json`;

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(JSON.stringify(data, null, 2));
    } catch (error) {
      next(error);
    }
  };
}
