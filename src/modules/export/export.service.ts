import { injectable } from "tsyringe";
import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";

@injectable()
export class ExportService {
  private prisma: PrismaService;

  constructor(PrismaClient: PrismaService) {
    this.prisma = PrismaClient;
  }
  getProjectExport = async (projectId: string, authUserId: string) => {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        deletedAt: null,
        OR: [
          { ownerId: authUserId },
          {
            memberships: {
              some: { userId: authUserId, deletedAt: null },
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        owner: { select: { id: true, name: true, email: true } },
        memberships: {
          where: { deletedAt: null },
          select: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        tasks: {
          where: { deletedAt: null },
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            assignee: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!project) throw new ApiError("Project not found", 404);

    return project;
  };
}
