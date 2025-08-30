import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from '../src/components/courses/courses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from '../src/entity/course.entity';
import { UsersService } from '../src/components/users/users.service';
import { User } from '../src/entity/user.entity';

describe('CoursesService', () => {
  let service: CoursesService;
  let userRepo: UsersService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(), // Keeping this line as it is part of the provider
            create: jest.fn(), // Keeping this line as it is part of the provider
            save: jest.fn(), // Keeping this line as it is part of the provider
            update: jest.fn(), // Keeping this line as it is part of the provider
            delete: jest.fn(), // Keeping this line as it is part of the provider
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findByIds: jest.fn((ids) => ids.map((id) => ({ id }))),
            createQueryBuilder: jest.fn(),
            hasId: jest.fn(),
            getId: jest.fn(),
            create: jest.fn(),
            merge: jest.fn(),
            preload: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            softRemove: jest.fn(),
            recover: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            upsert: jest.fn(),
            delete: jest.fn(),
            softDelete: jest.fn(),
            restore: jest.fn(),
            count: jest.fn(),
            find: jest.fn(),
            findAndCount: jest.fn(),
            findBy: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            findOneOrFail: jest.fn(),
            query: jest.fn(),
            clear: jest.fn(),
            increment: jest.fn(),
            decrement: jest.fn(),
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
    expect(repo.find).toHaveBeenCalledWith({ relations: ['users'] });
  });

  it('should call findOne', async () => {
    await service.findOne(1);
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['users'],
    });
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

  it('should throw error if course not found in addUserToCourse', async () => {
    repo.findOne.mockResolvedValue(undefined);
    await expect(
      service.addUserToCourse(1, { userIds: [1, 2] }),
    ).rejects.toThrow('Course not found');
  });

  it('should update users in addUserToCourse', async () => {
    service['usersRepository'] = {
      findByIds: jest.fn((ids) => ids.map((id) => ({ id }))),
    } as any;
    repo.findOne.mockResolvedValue({ id: 1, users: [] });
    repo.save.mockResolvedValue({ id: 1, users: [{ id: 1 }, { id: 2 }] });
    const result = await service.addUserToCourse(1, { userIds: [1, 2] });
    expect(result).toEqual({
      payload: { id: 1, users: [{ id: 1 }, { id: 2 }] },
      message: 'Relación de usuarios actualizada para el curso',
    });
  });

  it('should throw error if update affected is 0', async () => {
    repo.update.mockResolvedValue({ affected: 0 });
    await expect(service.update(1, { name: 'fail' })).rejects.toThrow(
      'Course not found',
    );
  });
});

//             findOne: jest.fn(),
//             create: jest.fn(),
//             save: jest.fn(),
//             update: jest.fn(),
//             delete: jest.fn(),
//           },
//         },
//         {
//           provide: getRepositoryToken(User),
//           useValue: {
//             findByIds: jest.fn((ids) => ids.map(id => ({ id }))),
//           },
//         },
//   it('should throw error if course not found in addUserToCourse', async () => {
//     repo.findOne.mockResolvedValue(undefined);
//     await expect(service.addUserToCourse(1, { userIds: [1, 2] })).rejects.toThrow('Course not found');
//   });

//   it('should update users in addUserToCourse', async () => {
//     repo.findOne.mockResolvedValue({ id: 1, users: [] });
//     repo.save.mockResolvedValue({ id: 1, users: [{ id: 1 }, { id: 2 }] });
//     const userRepo = {
//       findByIds: jest.fn((ids) => ids.map(id => ({ id }))),
//     };
//     service['usersRepository'] = userRepo;
//     const result = await service.addUserToCourse(1, { userIds: [1, 2] });
//     expect(result).toEqual({ payload: { id: 1, users: [{ id: 1 }, { id: 2 }] }, message: 'Relación de usuarios actualizada para el curso' });
//   });

//   it('should throw error if update affected is 0', async () => {
//     repo.update.mockResolvedValue({ affected: 0 });
//     await expect(service.update(1, { name: 'fail' })).rejects.toThrow('Course not found');
//   });
//       ],
//     }).compile();
//     service = module.get<CoursesService>(CoursesService);
//     repo = module.get(getRepositoryToken(Course));
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   it('should call findAll', async () => {
//     await service.findAll();
//     expect(repo.find).toHaveBeenCalledWith({ relations: ['users'] });
//   });

//   it('should call findOne', async () => {
//     await service.findOne(1);
//     expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['users'] });
//   });

//   it('should call create', async () => {
//     repo.create.mockReturnValue({ name: 'Test' });
//     repo.save.mockResolvedValue({ id: 1 });
//     const result = await service.create({ name: 'Test' });
//     expect(repo.create).toHaveBeenCalledWith({ name: 'Test' });
//     expect(repo.save).toHaveBeenCalledWith({ name: 'Test' });
//     expect(result).toEqual({ id: 1 });
//   });

//   it('should call update', async () => {
//     await service.update(1, { name: 'Updated' });
//     expect(repo.update).toHaveBeenCalledWith(1, { name: 'Updated' });
//   });

//   it('should call remove', async () => {
//     await service.remove(1);
//     expect(repo.delete).toHaveBeenCalledWith(1);
//   });
//   it('should throw error if course not found in addUserToCourse', async () => {
//     repo.findOne.mockResolvedValue(undefined);
//     await expect(service.addUserToCourse(1, { userIds: [1, 2] })).rejects.toThrow('Course not found');
//   });

//   it('should update users in addUserToCourse', async () => {
//     const userRepo = {
//       findByIds: jest.fn((ids) => ids.map(id => ({ id }))),
//     };
//     service['usersRepository'] = userRepo;
//     repo.findOne.mockResolvedValue({ id: 1, users: [] });
//     repo.save.mockResolvedValue({ id: 1, users: [{ id: 1 }, { id: 2 }] });
//     const result = await service.addUserToCourse(1, { userIds: [1, 2] });
//     expect(result).toEqual({ payload: { id: 1, users: [{ id: 1 }, { id: 2 }] }, message: 'Relación de usuarios actualizada para el curso' });
//   });

//   it('should throw error if update affected is 0', async () => {
//     repo.update.mockResolvedValue({ affected: 0 });
//     await expect(service.update(1, { name: 'fail' })).rejects.toThrow('Course not found');
//   });

// });
