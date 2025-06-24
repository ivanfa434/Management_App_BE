import { App } from "../../../src/app";
import { PrismaService } from "../../../src/modules/prisma/prisma.service";
import request from "supertest";

describe("GET /samples", () => {
  const { app } = new App();
  const prisma = new PrismaService();

  it("should display samples", async () => {
    const mockSampleData = [
      { name: "test 5" },
      { name: "test 6" },
      { name: "test 7" },
      { name: "test 8" },
    ];
    await prisma.sample.createMany({
      data: mockSampleData,
    });

    const response = await request(app).get("/samples");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(mockSampleData.length);
  });
});
