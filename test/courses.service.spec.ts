import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from '../src/courses/courses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from '../src/entity/course.entity';

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
    expect(repo.find).toHaveBeenCalled();
  });
});
