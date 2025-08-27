import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find({ relations: ['courses'] });
  }

  findOne(id: number) {
    return this.usersRepository.findOne({ where: { id }, relations: ['courses'] });
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email }, relations: ['courses'] });
  }

  async create(data: Partial<User>) {
    // Encriptar la contraseña antes de guardar
    if (data.password) {
      const bcrypt = await import('bcryptjs');
      data.password = await bcrypt.hash(data.password, 10);
    }
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  update(id: number, data: Partial<User>) {
    return this.usersRepository.update(id, data);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }

  async changePassword(id: number, password: string) {
    const bcrypt = await import('bcryptjs');
    const hash = await bcrypt.hash(password, 10);
    await this.usersRepository.update(id, { password: hash });
    return { message: 'Contraseña actualizada correctamente' };
  }

  async addCourse(userId: number, courseId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['courses'] });
    if (!user) return { message: 'Usuario no encontrado' };
    if (!user.courses) user.courses = [];
    if (user.courses.some(c => c.id === courseId)) {
      return { message: 'El usuario ya está inscrito en este curso' };
    }
    user.courses.push({ id: courseId } as any);
    await this.usersRepository.save(user);
    return { message: 'Curso agregado al usuario' };
  }

  async removeCourse(userId: number, courseId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['courses'] });
    if (!user) return { message: 'Usuario no encontrado' };
    user.courses = user.courses.filter(c => c.id !== courseId);
    await this.usersRepository.save(user);
    return { message: 'Curso eliminado del usuario' };
  }
}
