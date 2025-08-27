import { Course } from '../src/entity/course.entity';
import { User } from '../src/entity/user.entity';

describe('Course Entity', () => {
  it('should create a course', () => {
    const course = new Course();
    course.name = 'Math';
    expect(course.name).toBe('Math');
  });

  it('should allow assigning users', () => {
    const course = new Course();
    const user = new User();
    user.id = 1;
    course.users = [user];
    expect(course.users[0].id).toBe(1);
  });
});
