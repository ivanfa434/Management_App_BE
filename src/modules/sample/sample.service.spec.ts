import { mock } from "node:test";
import {
  Context,
  createMockContext,
  MockContext,
} from "../../../test/integration/context";
import { SampleService } from "./sample.service";

describe("SampleService", () => {
  let mockCtx: MockContext;
  let ctx: Context;
  let sampleService: SampleService;

  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    sampleService = new SampleService(ctx.prisma);
  });

  describe("getSamples", () => {
    it("should return samples", async () => {
      const mockSamples = [
        { id: 1, name: "mock 1", createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: "mock 2", createdAt: new Date(), updatedAt: new Date() },
        { id: 3, name: "mock 3", createdAt: new Date(), updatedAt: new Date() },
      ];

      mockCtx.prisma.sample.findMany.mockResolvedValue(mockSamples);

      const result = await sampleService.getSamples();

      expect(result).toBe(mockSamples);
    });
  });
  describe("getSample", () => {
    it("should return sample", async () => {
      const mockSample = {
        id: 1,
        name: "mock 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockCtx.prisma.sample.findFirst.mockResolvedValueOnce(mockSample);

      const result = await sampleService.getSample(mockSample.id);

      expect(result).toBe(mockSample);
    });

    it("should throw an error if samples with the given id does not exist", async () => {
      const mockSampleId = -1;

      mockCtx.prisma.sample.findFirst.mockResolvedValueOnce(null);

      await expect(sampleService.getSample(mockSampleId)).rejects.toThrow(
        "Sample not found"
      );
    });
  });
  describe("createSample", () => {
    it("should create sample successfully", async () => {
      const mockSample = {
        id: 1,
        name: "mock 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockCtx.prisma.sample.create.mockResolvedValueOnce(mockSample);

      const result = await sampleService.createSample(mockSample);

      expect(result).toBe(mockSample);
    });
  });
});
