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

  create(data: Partial<User>) {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  update(id: number, data: Partial<User>) {
    return this.usersRepository.update(id, data);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
