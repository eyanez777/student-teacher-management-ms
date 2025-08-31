import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../src/components/users/users.service';
import { Course } from '../src/entity/course.entity';
import { User } from '../src/entity/user.entity';
import bcrypt from 'bcryptjs';

// Mock para la función utilitaria de hash
jest.mock('../src/utils/hash.util', () => ({
  hashPassword: jest.fn(async (password: string) => `hashed_${password}`),
  comparePasswords: jest.fn(
    async (password: string, hashedPassword: string) =>
      password === hashedPassword.replace('hashed_', ''),
  ),
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
            findByIds: jest.fn((ids) => ids.map((id) => ({ id }))),
            findBy: jest.fn((conditions) => {
              const users = [
                { id: 1, email: 'test@mail.com' },
                { id: 2, email: 'user@mail.com' },
              ];
              return users.filter((user) => user.id === conditions.id);
            }),
          },
        },
        {
          provide: getRepositoryToken(Course),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByIds: jest.fn((ids) => ids.map((id) => ({ id }))),
            findBy: jest.fn((conditions) => {
              const users = [
                { id: 1, email: 'test@mail.com', role: 'admin', courses: [] },
                { id: 2, email: 'user@mail.com', role: 'user', courses: [] },
                { id: 3, email: 'admin@mail.com', role: 'admin', courses: [] },
              ];
              return users.filter((user) => user.id === conditions);
            }),
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
    const result = await service.addCourse(1, [2]);
    expect(result).toEqual({
      message: 'Relación de cursos actualizada para el usuario',
      payload: {},
    });
  });

  it('should call findAll', async () => {
    await service.findAll();
    expect(repo.find).toHaveBeenCalledWith({ relations: ['courses'] });
  });

  it('should call findOne', async () => {
    await service.findOne('1');
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['courses'],
    });
  });

  it('should call findByEmail', async () => {
    await service.findByEmail('test@mail.com');
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { email: 'test@mail.com' },
      relations: ['courses'],
    });
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
    await service.update('1', { name: 'Test' });
    expect(repo.update).toHaveBeenCalledWith('1', { name: 'Test' });
  });

  it('should call remove', async () => {
    await service.remove('1');
    expect(repo.delete).toHaveBeenCalledWith('1');
  });

  it('should call removeCourse', async () => {
    const mock = { id: '1', courses: [{ id: 2 }] };
    repo.findOne.mockResolvedValue(mock);
    const res = await service.removeCourse('1', 2);

    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['courses'],
    });
  });

  it('should throw if user not found', async () => {
    repo.findOne.mockResolvedValue(undefined);
    await expect(service.changePassword('1', 'old', 'new')).rejects.toThrow(
      'Usuario no encontrado',
    );
  });

  it('should throw if current password is incorrect', async () => {
    repo.findOne.mockResolvedValue({ id: 1, password: 'hashedpass' });
    const comparePasswords = require('../src/utils/hash.util').comparePasswords;
    comparePasswords.mockResolvedValueOnce(false); // current password check fails
    await expect(
      service.changePassword('1', 'wrong', 'newpass'),
    ).rejects.toThrow('La contraseña actual es incorrecta');
  });

   
  it('should throw if new password is same as current', async () => {
    repo.findOne.mockResolvedValue({ id: 1, password: 'hashedpass' });
    const comparePasswords = require('../src/utils/hash.util').comparePasswords;
    comparePasswords.mockResolvedValueOnce(true); // current password correct
    comparePasswords.mockResolvedValueOnce(true); // new password same as current
    await expect(
      service.changePassword('1', 'oldpass', 'oldpass'),
    ).rejects.toThrow('La nueva contraseña no puede ser igual a la actual');
  });
   

  it('should update password if all checks pass', async () => {
    repo.findOne.mockResolvedValue({ id: 1, password: 'hashedpass' });
    const comparePasswords = require('../src/utils/hash.util').comparePasswords;
    comparePasswords.mockResolvedValueOnce(true); // current password correct
    comparePasswords.mockResolvedValueOnce(false); // new password different
    jest.spyOn(repo, 'update').mockResolvedValue({});
    const result = await service.changePassword('1', 'oldpass', 'newpass');
    expect(repo.update).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Contraseña actualizada correctamente' });
  });

  it('should add course to user if not already enrolled', async () => {
    repo.findOne.mockResolvedValue({ id: 1, courses: [1] });
    repo.save.mockResolvedValue({});
    const result = await service.addCourse(1, [2]);
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual({
      message: 'Relación de cursos actualizada para el usuario',
      payload: {},
    });
  });

  it('should not add course if already enrolled', async () => {
    repo.findOne.mockResolvedValue({ id: 1, courses: [2] });
    const result = await service.addCourse(1, [2]);
    expect(result).toEqual({
      message: 'Relación de cursos actualizada para el usuario',
      payload: undefined,
    });
  });

  it('should call findById and return user', async () => {
    repo.findOne.mockResolvedValue({ id: 1, courses: [] });
    const result = await service.findById(1);
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['courses'],
    });
    expect(result).toEqual({ id: 1, courses: [] });
  });

  it('should return undefined if user not found in findById', async () => {
    repo.findOne.mockResolvedValue(undefined);
    const result = await service.findById(999);
    expect(result).toBeUndefined();
  });

  it('should handle error in create if email is missing', async () => {
    await expect(service.create({ password: '1234' })).rejects.toThrow(
      'Error al crear el usuario',
    );
  });

  it('should handle error in create if email already exists', async () => {
    repo.findOne.mockResolvedValueOnce({ id: 1, email: 'a@a.com' });
    await expect(
      service.create({ email: 'a@a.com', password: '1234' }),
    ).rejects.toThrow('El correo ya está en uso');
  });

  it('should handle error in create if save fails', async () => {
    repo.findOne.mockResolvedValueOnce(undefined);
    repo.create.mockImplementation((data) => data);
    repo.save.mockRejectedValueOnce(new Error('Error al crear el usuario'));
    await expect(
      service.create({ email: 'a@a.com', password: '1234' }),
    ).rejects.toThrow('Error al crear el usuario');
  });

  it('should return not found in removeCourse if user does not exist', async () => {
    repo.findOne.mockResolvedValue(undefined);
    const result = await service.removeCourse('1', 2);
    expect(result).toEqual({ message: 'Usuario no encontrado' });
  });

  it('should return not found in changePassword if user does not exist', async () => {
    repo.update.mockRejectedValueOnce(new Error('Usuario no encontrado'));
    await expect(service.changePassword('1', '2', 'newpass')).rejects.toThrow(
      'Usuario no encontrado',
    );
  });

  it('should handle error in update', async () => {
    repo.update.mockRejectedValueOnce(new Error('Update error'));
    await expect(service.update('1', { name: 'Test' })).rejects.toThrow(
      'Update error',
    );
  });

  it('should handle error in remove', async () => {
    repo.delete.mockRejectedValueOnce(new Error('Delete error'));
    await expect(service.remove('1')).rejects.toThrow('Delete error');
  });
});
