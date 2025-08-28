import { User, UserRole } from '../src/entity/user.entity';
import { Course } from '../src/entity/course.entity';

describe('User Entity', () => {
  it('should create a user with default role', () => {
    const user = new User();
    user.email = 'a@a.com';
    user.password = '1234';
    user.name = 'Test';
    user.role = UserRole.ALUMNO; // Aseguramos que el rol es ALUMNO por defecto
    
    expect(user.role).toBe(UserRole.ALUMNO);
  });

  it('should allow assigning courses', () => {
    const user = new User();
    const course = new Course();
    course.id = 1;
    user.courses = [course];
    expect(user.courses[0].id).toBe(1);
  });
});
