import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: any;

  beforeEach(async () => {
    authService = { login: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call authService.login and return result', async () => {
    const loginResult = { access_token: 'token', user: { id: 1 } };
    authService.login.mockResolvedValue(loginResult);
    const result = await controller.login({ email: 'test@mail.com', password: '1234' });
    expect(authService.login).toHaveBeenCalledWith('test@mail.com', '1234');
    expect(result).toEqual(loginResult);
  });
});
