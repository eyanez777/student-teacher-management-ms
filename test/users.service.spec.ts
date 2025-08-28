

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../src/components/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/entity/user.entity';


// Mock para la función utilitaria de hash
jest.mock('../src/utils/hash.util', () => ({
  hashPassword: jest.fn(async (password: string) => `hashed_${password}`),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
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
    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

    it('should add course to user with no courses array', async () => {
    repo.findOne.mockResolvedValue({ id: 1 });
    repo.save.mockResolvedValue({});
    const result = await service.addCourse(1, 2);
    expect(result).toEqual({ message: 'Curso agregado al usuario' });
  });

  it('should call findAll', async () => {
    await service.findAll();
    expect(repo.find).toHaveBeenCalledWith({ relations: ['courses'] });
  });

  it('should call findOne', async () => {
    await service.findOne("1");
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['courses'] });
  });

  it('should call findByEmail', async () => {
    await service.findByEmail('test@mail.com');
    expect(repo.findOne).toHaveBeenCalledWith({ where: { email: 'test@mail.com' }, relations: ['courses'] });
  });

  it('should call create and hash password', async () => {
    const saveSpy = jest.spyOn(repo, 'save').mockResolvedValue({ id: 1 });
    const userData = { email: 'a@a.com', password: '1234' };
    const result = await service.create(userData);
    expect(repo.create).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalled();
    expect(result).toEqual({ id: 1 });
  });

  it('should call update', async () => {
    await service.update("1", { name: 'Test' });
    expect(repo.update).toHaveBeenCalledWith("1", { name: 'Test' });
  });

  it('should call remove', async () => {
    await service.remove("1");
    expect(repo.delete).toHaveBeenCalledWith("1");
  });

  it('should call removeCourse', async () => {
    const mock = { id: "1", courses: [{ id: 2 }] };
    repo.findOne.mockResolvedValue(mock);
    const res = await service.removeCourse("1", 2);
    console.log('res log',res);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['courses'] });
  });

  it('should call changePassword', async () => {
    jest.spyOn(repo, 'update').mockResolvedValue({});
    const result = await service.changePassword("1", 'newpass');
    expect(repo.update).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Contraseña actualizada correctamente' });
  });

  it('should add course to user if not already enrolled', async () => {
    repo.findOne.mockResolvedValue({ id: 1, courses: [] });
    repo.save.mockResolvedValue({});
    const result = await service.addCourse(1, 2);
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Curso agregado al usuario' });
  });

  it('should not add course if already enrolled', async () => {
    repo.findOne.mockResolvedValue({ id: 1, courses: [{ id: 2 }] });
    const result = await service.addCourse(1, 2);
    expect(result).toEqual({ message: 'El usuario ya está inscrito en este curso' });
  });

  it('should return not found if user does not exist in addCourse', async () => {
    repo.findOne.mockResolvedValue(undefined);
    const result = await service.addCourse(1, 2);
    expect(result).toEqual({ message: 'Usuario no encontrado' });
  });
});
