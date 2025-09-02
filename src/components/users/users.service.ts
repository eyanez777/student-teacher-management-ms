
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import { Course } from '../../entity/course.entity';
import { hashPassword, comparePasswords } from '../../utils/hash.util';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
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
   //Cambia la contraseña de un usuario, validando la contraseña actual y que la nueva sea diferente.
  async changePassword(id: string, currentPassword: string, newPassword: string) {
    
    try{
    const user = await this.usersRepository.findOne({ where: { id: Number(id) } });
    if (!user) throw new Error('Usuario no encontrado');
    // Validar contraseña actual
    const isMatch = await comparePasswords(currentPassword, user.password);
    if (!isMatch) {
      throw new Error('La contraseña actual es incorrecta');
    }
    // Validar que la nueva contraseña sea diferente y que la nueva contraseña no este vacia
    if(!newPassword) throw new Error('La nueva contraseña es requerida');
    const isSame = await comparePasswords(newPassword, user.password);
    if (isSame) {
      throw new Error('La nueva contraseña no puede ser igual a la actual');
    }
    // Encriptar y guardar
    const hash = await hashPassword(newPassword, 10);
    const resp = await this.usersRepository.update(Number(id), { password: hash });
    if(resp.affected === 0) throw new Error ('Error al actualizar la contraseña')
    
    return { message: 'Contraseña actualizada correctamente' };
  }catch(error){
    
    const { message } = error;
    return {message: message};
  }
  }

  async addCourse(userId: number, courseIds: number[]) {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['courses'] });
    if (!user) return { message: 'Usuario no encontrado' };

    // Buscar todos los cursos que existen en courseIds usando el repositorio tipado
    const courses = courseIds.length > 0
      ? await this.coursesRepository.findBy({ id: In(courseIds) })
      : [];

    user.courses = courses;
    const resp = await this.usersRepository.save(user);
   
    return {payload:resp, message: 'Relación de cursos actualizada para el usuario' };
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

    async findByPhone(phone: string) {
    return this.usersRepository.findOne({ where: { phone } });
  }

  async setResetToken(userId: number, token: string, expires: number) {
    await this.usersRepository.update(userId, { resetToken: token, resetTokenExpires: expires });
  }

  async findByResetToken(token: string) {
    return this.usersRepository.findOne({ where: { resetToken: token } });
  }

  async changePasswordByReset(userId: number, newPassword: string) {
    const hash = await hashPassword(newPassword, 10);
    await this.usersRepository.update(userId, { password: hash });
  }

  async clearResetToken(userId: number) {
    const resetToken = ''
    
    await this.usersRepository.update(userId, { resetToken: resetToken, resetTokenExpires: null });
  }
  }
