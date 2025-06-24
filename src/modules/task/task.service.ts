// src/modules/task/task.service.ts
import { injectable } from "tsyringe";
import { PrismaService } from "../prisma/prisma.service";
import { ApiError } from "../../utils/api-error";
import { UpdateTaskDTO } from "./dto/update-task.dto";
import { CreateTaskDTO } from "./dto/create-task.dto";

@injectable()
export class TaskService {
  private prisma: PrismaService;

  constructor(PrismaClient: PrismaService) {
    this.prisma = PrismaClient;
  }

  getTasksByProject = async (projectId: string, authUserId: string) => {
    const hasAccess = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        deletedAt: null,
        OR: [
          { ownerId: authUserId },
          { memberships: { some: { userId: authUserId, deletedAt: null } } },
        ],
      },
    });

    if (!hasAccess) throw new ApiError("Forbidden", 403);

    return await this.prisma.task.findMany({
      where: { projectId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        assignee: { select: { id: true, name: true, email: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
  };

  createTask = async (
    projectId: string,
    authUserId: string,
    body: CreateTaskDTO
  ) => {
    const { title, description, assigneeId } = body;

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

    if (!project) throw new ApiError("Forbidden", 403);

    return await this.prisma.task.create({
      data: {
        title,
        description,
        assigneeId,
        projectId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        assigneeId: true,
        projectId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  };

  getTaskById = async (taskId: string, authUserId: string) => {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
        OR: [
          { project: { ownerId: authUserId } },
          {
            project: {
              memberships: {
                some: { userId: authUserId, deletedAt: null },
              },
            },
          },
        ],
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, title: true } },
      },
    });

    if (!task) throw new ApiError("Task not found", 404);

    return task;
  };

  updateTask = async (
    taskId: string,
    authUserId: string,
    body: UpdateTaskDTO
  ) => {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
        OR: [
          { project: { ownerId: authUserId } },
          {
            project: {
              memberships: {
                some: { userId: authUserId, deletedAt: null },
              },
            },
          },
        ],
      },
    });

    if (!task) throw new ApiError("Forbidden", 403);

    return await this.prisma.task.update({
      where: { id: taskId },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        assigneeId: body.assigneeId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        assigneeId: true,
        projectId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  };

  deleteTask = async (taskId: string, authUserId: string) => {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
        OR: [
          { project: { ownerId: authUserId } },
          {
            project: {
              memberships: {
                some: { userId: authUserId, deletedAt: null },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        assignee: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, title: true } },
      },
    });

    if (!task) throw new ApiError("Forbidden", 403);

    await this.prisma.task.update({
      where: { id: taskId },
      data: { deletedAt: new Date() },
    });

    return { message: "Task deleted successfully" };
  };
}
