import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from '../src/components/courses/courses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from '../src/entity/course.entity';
import { User } from '../src/entity/user.entity';

describe('CoursesService', () => {
  let service: CoursesService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<CoursesService>(CoursesService);
    repo = module.get(getRepositoryToken(Course));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findAll', async () => {
    await service.findAll();
    expect(repo.find).toHaveBeenCalledWith({ relations: ['users'] });
  });

  it('should call findOne', async () => {
    await service.findOne(1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['users'] });
  });

  it('should call create', async () => {
    repo.create.mockReturnValue({ name: 'Test' });
    repo.save.mockResolvedValue({ id: 1 });
    const result = await service.create({ name: 'Test' });
    expect(repo.create).toHaveBeenCalledWith({ name: 'Test' });
    expect(repo.save).toHaveBeenCalledWith({ name: 'Test' });
    expect(result).toEqual({ id: 1 });
  });

  it('should call update', async () => {
    await service.update(1, { name: 'Updated' });
    expect(repo.update).toHaveBeenCalledWith(1, { name: 'Updated' });
  });

  it('should call remove', async () => {
    await service.remove(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });
});
