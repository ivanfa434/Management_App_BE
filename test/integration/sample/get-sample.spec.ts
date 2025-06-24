import { App } from "../../../src/app";
import { PrismaService } from "../../../src/modules/prisma/prisma.service";
import request from "supertest";

describe("GET /samples", () => {
  const { app } = new App();
  const prisma = new PrismaService();

  it("should provide sample with the requested id", async () => {
    const mockSampleData = [{ name: "test 1" }];
    await prisma.sample.createMany({
      data: mockSampleData,
    });

    const response = await request(app).get("/samples/1");

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBeDefined();
  });

  it("should return 404 not found if sample with the given id does not exist", async () => {
    const nonExistentSampleId = 9999999;

    const response = await request(app).get(`/samples/${nonExistentSampleId}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Sample not found");
  });
});