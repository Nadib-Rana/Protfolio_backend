import { Test, TestingModule } from "@nestjs/testing";
import { StorageController } from "./storage.controller";
import { StorageService } from "./storage.service";

describe("StorageController", () => {
  let controller: StorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageController],
      providers: [
        {
          provide: StorageService,
          useValue: {
            getPresignedUploadUrl: jest.fn().mockResolvedValue("https://upload-url"),
            getPresignedObjectUrl: jest.fn().mockResolvedValue("https://object-url"),
            getObjectUrl: jest.fn().mockReturnValue("https://object-url"),
          },
        },
      ],
    }).compile();

    controller = module.get<StorageController>(StorageController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
