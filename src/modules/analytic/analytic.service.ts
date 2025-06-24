import { injectable } from "tsyringe";
import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";

@injectable()
export class AnalyticService {
  private prisma: PrismaService;

  constructor(PrismaClient: PrismaService) {
    this.prisma = PrismaClient;
  }
  getTaskAnalytics = async (projectId: string, authUserId: string) => {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        deletedAt: null,
        OR: [
          { ownerId: authUserId },
          { memberships: { some: { userId: authUserId, deletedAt: null } } },
        ],
      },
    });

    if (!project) throw new ApiError("Project not found or access denied", 403);

    const [todo, inProgress, done] = await Promise.all([
      this.prisma.task.count({
        where: {
          projectId,
          deletedAt: null,
          status: "TODO",
        },
      }),
      this.prisma.task.count({
        where: {
          projectId,
          deletedAt: null,
          status: "IN_PROGRESS",
        },
      }),
      this.prisma.task.count({
        where: {
          projectId,
          deletedAt: null,
          status: "DONE",
        },
      }),
    ]);

    return {
      todo,
      inProgress,
      done,
      total: todo + inProgress + done,
    };
  };
}
