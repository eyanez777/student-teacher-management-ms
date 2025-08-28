import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../entity/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  findAll() {
    return this.coursesRepository.find({ relations: ['users'] });
  }

  findOne(id: number) {
    return this.coursesRepository.findOne({ where: { id }, relations: ['users'] });
  }

  create(data: Partial<Course>) {
    const course = this.coursesRepository.create(data);
    return this.coursesRepository.save(course);
  }

  async update(id: number, data: Partial<Course>) {
    const res = await this.coursesRepository.update(id, data);
    console.log(res);
    return 
  }

  remove(id: number) {
    return this.coursesRepository.delete(id);
  }
}
