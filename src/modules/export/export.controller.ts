import { injectable } from "tsyringe";
import { ExportService } from "./export.service";
import { NextFunction, Request, Response } from "express";

@injectable()
export class ExportController {
  private exportService: ExportService;

  constructor(ExportService: ExportService) {
    this.exportService = ExportService;
  }
  exportProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = req.params.id;
      const authUserId = res.locals.user.id;
      const data = await this.exportService.getProjectExport(
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
