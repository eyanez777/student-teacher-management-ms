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
    const { userIds } = body;
    const course = await this.coursesRepository.findOne({ where: { id: courseId }, relations: ['users'] });
    if (!course) {
      throw new Error('Course not found');
    }

    // Buscar todos los usuarios que existen en userIds
    const users = await this.usersRepository.findByIds(userIds);
    
    // Actualizar la relación: solo los usuarios en el array quedarán asignados
    course.users = users;
    const respSave = await this.coursesRepository.save(course);
    return {
      payload: respSave,
      message: 'Relación de usuarios actualizada para el curso',
    };
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
