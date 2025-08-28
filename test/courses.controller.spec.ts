
import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from '../src/components/courses/courses.controller';
import { CoursesService } from '../src/components/courses/courses.service';

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: CoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<CoursesController>(CoursesController);
    service = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle error in findOne', async () => {
  (service.findOne as jest.Mock).mockRejectedValue(new Error('Not found'));
  await expect(controller.findOne('1')).rejects.toThrow('Not found');
});

  it('should handle error in create', async () => {
    (service.create as jest.Mock).mockRejectedValue(new Error('Create error'));
    await expect(controller.create({ name: 'Math' })).rejects.toThrow('Create error');
  });

  it('should handle error in update', async () => {
    (service.update as jest.Mock).mockRejectedValue(new Error('Update error'));
    await expect(controller.update('1', { name: 'Math2' })).rejects.toThrow('Update error');
  });

  it('should handle error in remove', async () => {
    (service.remove as jest.Mock).mockRejectedValue(new Error('Remove error'));
    await expect(controller.remove('1')).rejects.toThrow('Remove error');
  });

  it('should call findAll', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call findOne', async () => {
    await controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should call create', async () => {
    const dto = { name: 'Math' };
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call update', async () => {
    const dto = { name: 'Math2' };
    await controller.update('1', dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should call remove', async () => {
    await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
