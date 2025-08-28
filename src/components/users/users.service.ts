import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import { hashPassword } from '../../utils/hash.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find({ relations: ['courses'] });
  }

  findOne(id: string) {
    return this.usersRepository.findOne({ where: { id: parseInt(id) }, relations: ['courses'] });
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email }, relations: ['courses'] });
  }

  async create(data: Partial<User>) {

    try{
    //primero buscar si existe el correo
    if (!data?.email) {
      throw new Error('El correo es requerido');
    }
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      return Promise.reject(new Error('El correo ya está en uso'));
    }
    // Encriptar la contraseña antes de guardar

    if (data.password) {
      data.password = await hashPassword(data.password, 10);
    }
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }
  catch (error) {
    return Promise.reject(new Error('Error al crear el usuario', error));
  }
  }

  async update(id: string, data: Partial<User>) {
    return this.usersRepository.update(id, data);
  }

  async remove(id: string) {
    return this.usersRepository.delete(id);
  }

  async changePassword(id: string, password: string) {
    const hash = await hashPassword(password, 10);
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

  async removeCourse(userId: string, courseId: number) {
    const user = await this.usersRepository.findOne({ where: { id: parseInt(userId) }, relations: ['courses'] });
    if (!user) return { message: 'Usuario no encontrado' };
    user.courses = user.courses.filter(c => c.id !== courseId);
    await this.usersRepository.save(user);
    return { message: 'Curso eliminado del usuario' };
  }

  async findById(id: number) {
    return this.usersRepository.findOne({ where: { id }, relations: ['courses'] });
  }
  }
