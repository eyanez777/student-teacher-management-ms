
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../src/components/users/users.controller';
import { UsersService } from '../src/components/users/users.service';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { CreateUserDto } from 'src/components/users/dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: any;
  let userRepository: Partial<Repository<User>>;

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),

      usersRepository: {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      findByEmail: jest.fn(),
      changePassword: jest.fn(),
      addCourse: jest.fn(),
      removeCourse: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: service },
      ],
    }).compile();
    controller = module.get<UsersController>(UsersController);
  });
  it('should get profile', async () => {
    (service.findOne as jest.Mock).mockResolvedValue({ id: 1, name: 'Test' });
    const req = { user: { userId: 1 } };
    const result = await controller.getProfile(req);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1, name: 'Test' });
  });

    it('should call update', async () => {
    const dto = { name: 'Updated' };
    await controller.update('1', dto);
    expect(service.update).toHaveBeenCalledWith('1', dto);
  });

  it('should call remove', async () => {
    await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith('1');
  });

  it('should get my courses', async () => {
    (service.findOne as jest.Mock).mockResolvedValue({ id: 1, courses: [{ id: 2 }] });
    const req = { user: { userId: 1 } };
    const result = await controller.getMyCourses(req);
    expect(result).toEqual([{ id: 2 }]);
  });

  it('should get my course detail if enrolled', async () => {
    (service.findOne as jest.Mock).mockResolvedValue({ id: 1, courses: [{ id: 2, name: 'Math' }] });
    const req = { user: { userId: 1 } };
    const result = await controller.getMyCourseDetail(req, '2');
    expect(result).toEqual({ id: 2, name: 'Math' });
  });

  it('should return message if not enrolled in course', async () => {
    (service.findOne as jest.Mock).mockResolvedValue({ id: 1, courses: [{ id: 3 }] });
    const req = { user: { userId: 1 } };
    const result = await controller.getMyCourseDetail(req, '2');
    expect(result).toEqual({ message: 'No tienes acceso a este curso' });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('test de create user', async () => {
    const createUserDto: CreateUserDto = { email: 'test@mail.com', password: '1234', name: 'Test User' };
    const resp = await controller.create(createUserDto);
    expect(resp).toEqual({
      status: 'success',
      payload: undefined,
    });
    expect(service.create).toHaveBeenCalledWith(createUserDto);
  });

  it('test findOne user', async () => {
    const userId = "1";
    const rest = await controller.findOne(userId);
    expect(service.findOne).toHaveBeenCalledWith(userId);
  });

  it('should call findAll', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });
});
