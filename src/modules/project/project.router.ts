import { Router } from "express";
import { injectable } from "tsyringe";
import { ProjectController } from "./project.controller";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { JWT_SECRET_KEY } from "../../config";
import { validateBody } from "../../middlewares/validation.middleware";
import { CreateProjectDTO } from "./dto/create-project.dto";
import { UpdateProjectDTO } from "./dto/update-project.dto";
import { InviteMemberDTO } from "./dto/invite-mamber.dto";

@injectable()
export class ProjectRouter {
  private router: Router;
  private projectController: ProjectController;
  private jwtMiddleware: JwtMiddleware;

  constructor(
    ProjectController: ProjectController,
    JwtMiddleware: JwtMiddleware
  ) {
    this.router = Router();
    this.projectController = ProjectController;
    this.jwtMiddleware = JwtMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(
      "/",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      this.projectController.getUserProjects
    );

    this.router.post(
      "/",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      validateBody(CreateProjectDTO),
      this.projectController.createProject
    );

    this.router.get(
      "/:id",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      this.projectController.getProjectById
    );

    this.router.patch(
      "/:id",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      validateBody(UpdateProjectDTO),
      this.projectController.updateProject
    );

    this.router.delete(
      "/:id",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      this.projectController.deleteProject
    );

    this.router.post(
      "/:id/members",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      validateBody(InviteMemberDTO),
      this.projectController.inviteMember
    );

    this.router.get(
      "/:id/members",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      this.projectController.getProjectMembers
    );

    this.router.delete(
      "/:id/members/:userId",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY!),
      this.projectController.removeProjectMember
    );
  };

  getRouter() {
    return this.router;
  }
}
