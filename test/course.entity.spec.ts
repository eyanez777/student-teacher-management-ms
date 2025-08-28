
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

    it('should allow assigning multiple users to a course (ManyToMany)', () => {
    const course = new Course();
    const user1 = new User();
    user1.id = 1;
    const user2 = new User();
    user2.id = 2;
    const user3 = new User();
    user3.id = 3;
    course.users = [user1, user2, user3];
    expect(course.users.length).toBe(3);
    expect(course.users[0].id).toBe(1);
    expect(course.users[1].id).toBe(2);
    expect(course.users[2].id).toBe(3);
  });
});
