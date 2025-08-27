import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

const mockUser = {
  id: 1,
  email: 'test@mail.com',
  password: 'hashedpass',
  name: 'Test',
  role: 'admin',
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: any;
  let jwtService: any;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('token'),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: require('../src/components/users/users.service').UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    })
      .overrideProvider(require('../src/components/users/users.service').UsersService).useValue(usersService)
      .overrideProvider(JwtService).useValue(jwtService)
      .compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user with correct password', async () => {
    usersService.findByEmail.mockResolvedValue({ ...mockUser });
    jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(true);
    const result = await service.validateUser('test@mail.com', '1234');
    expect(result).toMatchObject({ id: 1, email: 'test@mail.com', name: 'Test', role: 'admin' });
  });

  it('should return null if user not found', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    const result = await service.validateUser('notfound@mail.com', '1234');
    expect(result).toBeNull();
  });

  it('should return null if password is invalid', async () => {
    usersService.findByEmail.mockResolvedValue({ ...mockUser });
    jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(false);
    const result = await service.validateUser('test@mail.com', 'wrong');
    expect(result).toBeNull();
  });

  it('should login and return token for valid credentials', async () => {
    usersService.findByEmail.mockResolvedValue({ ...mockUser });
    jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(true);
    const result = await service.login('test@mail.com', '1234');
    expect(jwtService.sign).toHaveBeenCalled();
    expect(result).toHaveProperty('access_token', 'token');
    expect(result.user).toMatchObject({ id: 1, email: 'test@mail.com', name: 'Test', role: 'admin' });
  });

  it('should throw UnauthorizedException for invalid credentials', async () => {
    usersService.findByEmail.mockResolvedValue({ ...mockUser });
    jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(false);
    await expect(service.login('test@mail.com', 'wrong')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if user not found', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    await expect(service.login('notfound@mail.com', '1234')).rejects.toThrow(UnauthorizedException);
  });
});
