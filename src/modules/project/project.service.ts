import { injectable } from "tsyringe";
import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProjectDTO } from "./dto/create-project.dto";
import { InviteMemberDTO } from "./dto/invite-mamber.dto";
import { UpdateProjectDTO } from "./dto/update-project.dto";

@injectable()
export class ProjectService {
  private prisma: PrismaService;

  constructor(PrismaClient: PrismaService) {
    this.prisma = PrismaClient;
  }

  getAllUserProjects = async (authUserId: string) => {
    const projects = await this.prisma.project.findMany({
      where: {
        deletedAt: null,
        OR: [
          { ownerId: authUserId },
          {
            memberships: {
              some: {
                userId: authUserId,
                deletedAt: null,
              },
            },
          },
        ],
      },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            memberships: {
              where: {
                deletedAt: null,
              },
            },
            tasks: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    });

    return projects;
  };

  createProject = async (authUserId: string, body: CreateProjectDTO) => {
    const { title, description } = body;

    const existing = await this.prisma.project.findFirst({
      where: {
        title,
        ownerId: authUserId,
        deletedAt: null,
      },
    });

    if (existing) {
      throw new ApiError("You already have a project with this title", 400);
    }

    const project = await this.prisma.project.create({
      data: {
        title,
        description,
        ownerId: authUserId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return project;
  };

  getProjectById = async (projectId: string, authUserId: string) => {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        deletedAt: null,
        OR: [
          { ownerId: authUserId },
          {
            memberships: {
              some: {
                userId: authUserId,
                deletedAt: null,
              },
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
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        memberships: {
          where: { deletedAt: null },
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new ApiError("Project not found or access denied", 403);
    }

    return project;
  };

  updateProject = async (
    id: string,
    body: UpdateProjectDTO,
    authUserId: string
  ) => {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!project) {
      throw new ApiError("Project not found", 404);
    }

    if (project.ownerId !== authUserId) {
      throw new ApiError("Forbidden", 403);
    }

    if (body.title) {
      const titleUsed = await this.prisma.project.findFirst({
        where: {
          id: { not: id },
          ownerId: authUserId,
          title: body.title,
          deletedAt: null,
        },
      });

      if (titleUsed) {
        throw new ApiError("Project title already used", 400);
      }
    }

    const updated = await this.prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
      },
      select: {
        id: true,
        title: true,
        description: true,
        updatedAt: true,
      },
    });

    return updated;
  };

  deleteProject = async (id: string, authUserId: string) => {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!project) {
      throw new ApiError("Project not found", 404);
    }

    if (project.ownerId !== authUserId) {
      throw new ApiError("Forbidden", 403);
    }

    await this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: "Delete project success" };
  };

  inviteMember = async (
    projectId: string,
    authUserId: string,
    body: InviteMemberDTO
  ) => {
    const { email } = body;

    const project = await this.prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
    });

    if (!project) throw new ApiError("Project not found", 404);
    if (project.ownerId !== authUserId) throw new ApiError("Forbidden", 403);

    const targetUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!targetUser) {
      throw new ApiError("User with this email not found", 404);
    }

    if (targetUser.id === authUserId) {
      throw new ApiError("Cannot invite yourself", 400);
    }

    const existingMembership = await this.prisma.membership.findFirst({
      where: {
        userId: targetUser.id,
        projectId,
      },
    });

    if (existingMembership) {
      if (existingMembership.deletedAt === null) {
        throw new ApiError("User is already a member of this project", 400);
      } else {
        await this.prisma.membership.update({
          where: { id: existingMembership.id },
          data: {
            deletedAt: null,
            updatedAt: new Date(),
          },
        });

        return {
          message: "User re-invited successfully",
          action: "restored",
        };
      }
    }

    await this.prisma.membership.create({
      data: {
        userId: targetUser.id,
        projectId,
      },
    });

    return {
      message: "User invited successfully",
      action: "created",
    };
  };

  inviteMemberUpsert = async (
    projectId: string,
    authUserId: string,
    body: InviteMemberDTO
  ) => {
    const { email } = body;

    const project = await this.prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
    });

    if (!project) throw new ApiError("Project not found", 404);
    if (project.ownerId !== authUserId) throw new ApiError("Forbidden", 403);

    const targetUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!targetUser) {
      throw new ApiError("User with this email not found", 404);
    }

    if (targetUser.id === authUserId) {
      throw new ApiError("Cannot invite yourself", 400);
    }

    const activeMembership = await this.prisma.membership.findFirst({
      where: {
        userId: targetUser.id,
        projectId,
        deletedAt: null,
      },
    });

    if (activeMembership) {
      throw new ApiError("User is already a member of this project", 400);
    }

    const membership = await this.prisma.membership.upsert({
      where: {
        userId_projectId: {
          userId: targetUser.id,
          projectId: projectId,
        },
      },
      update: {
        deletedAt: null,
        updatedAt: new Date(),
      },
      create: {
        userId: targetUser.id,
        projectId: projectId,
      },
    });

    return {
      message: "User invited successfully",
      membershipId: membership.id,
    };
  };

  getProjectMembers = async (projectId: string, authUserId: string) => {
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

    if (!project) throw new ApiError("Project not found", 403);

    const members = await this.prisma.membership.findMany({
      where: {
        projectId,
        deletedAt: null,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdAt: true,
      },
    });

    return members;
  };

  removeProjectMember = async (
    projectId: string,
    userId: string,
    authUserId: string
  ) => {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
    });

    if (!project) throw new ApiError("Project not found", 404);
    if (project.ownerId !== authUserId) throw new ApiError("Forbidden", 403);
    if (project.ownerId === userId)
      throw new ApiError("Cannot remove owner", 400);

    const membership = await this.prisma.membership.findFirst({
      where: {
        projectId,
        userId,
        deletedAt: null,
      },
    });

    if (!membership) throw new ApiError("User is not a member", 404);

    await this.prisma.membership.update({
      where: { id: membership.id },
      data: { deletedAt: new Date() },
    });

    return { message: "Member removed successfully" };
  };

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
