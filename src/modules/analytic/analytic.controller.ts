import { Request, Response, NextFunction } from "express";
import { AnalyticService } from "./analytic.service";
import { injectable } from "tsyringe";

@injectable()
export class AnalyticController {
  private analyticService: AnalyticService;
  
  constructor(AnalyticService: AnalyticService) {
    this.analyticService = AnalyticService;
  }
  getTaskAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authUserId = res.locals.user.id;
      const projectId = req.params.id;
      const result = await this.analyticService.getTaskAnalytics(
        projectId,
        authUserId
      );
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}
