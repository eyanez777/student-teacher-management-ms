import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../src/components/users/users.controller';
import { UsersService } from '../src/components/users/users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
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
    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('test de create user', async () => {
    const createUserDto = { email: 'test@mail.com', password: '1234', name: 'Test User' };
    await controller.create(createUserDto);
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
