import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../entity/course.entity';
import { User } from '../../entity/user.entity';
;

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.coursesRepository.find({ relations: ['users'] });
  }

  findOne(id: number) {
    return this.coursesRepository.findOne({ where: { id }, relations: ['users'] });
  }
  async addUserToCourse(courseId: number, body: any) {
    let users: User[] = [];
    let { userIds } = body;
    const course = await this.coursesRepository.findOne({ where: { id: courseId }, relations: ['users'] });
   
    
    for (const value of userIds) {
      const user = await this.usersRepository.findOne({ where: { id: value } });
      if (course?.users.some((u: User) => u.id === user?.id)) {
        console.log(`User with id ${value} is already assigned to this course.`);

      } else if (user && user.id !== undefined) {
        users.push({...user});
        console.log('User found:', user);
      } else {
        console.log(`User with id ${value} not found.`);
      }
    }
    
    if (!course) {
      throw new Error('Course not found');
    }

   course.users.push(...users);
   const respSave = await this.coursesRepository.save(course);
   return respSave;
  }

  create(data: Partial<Course>) {
    const course = this.coursesRepository.create(data);
    return this.coursesRepository.save(course);
  }

  async update(id: number, data: Partial<Course>) {
  
    const res = await this.coursesRepository.update(id, data);
    let courseBeforeUpdate;
    
    if (res?.affected === 0) {
      throw new Error('Course not found');
    } else {
      courseBeforeUpdate = await this.coursesRepository.findOne({ where: { id } });
    }

    return {
      payload: courseBeforeUpdate,
      message: 'Curso actualizado con exito'
    };
  }

  remove(id: number) {
    return this.coursesRepository.delete(id);
  }
}
