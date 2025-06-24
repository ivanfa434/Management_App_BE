import { injectable } from "tsyringe";
import { Prisma } from "../../generated/prisma";
import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";
import { GetUsersDTO } from "./dto/get-users.dto";

@injectable()
export class UserService {
  private prisma: PrismaService;

  constructor(PrismaClient: PrismaService) {
    this.prisma = PrismaClient;
  }

  getUsers = async (authUserId: string, query: GetUsersDTO) => {
    const { page, take, sortBy = "name", sortOrder = "asc", search } = query;

    const whereClause: Prisma.UserWhereInput = {
      id: { not: authUserId },
    };

    if (search) {
      whereClause.name = { contains: search, mode: "insensitive" };
    }

    const users = await this.prisma.user.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * take,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const count = await this.prisma.user.count({ where: whereClause });

    return {
      data: users,
      meta: { page, take, total: count },
    };
  };
  getUser = async (authUserId: string) => {
    const user = await this.prisma.user.findUnique({
      where: { id: authUserId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return user;
  };
}
