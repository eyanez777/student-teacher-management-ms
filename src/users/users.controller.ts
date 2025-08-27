


import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Solo admin puede ver todos los usuarios
  @Get()
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  // Un usuario autenticado puede ver su propio perfil
  @Get('me')
  @Roles('admin', 'alumno')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  // Alumno: ver todos sus cursos
  @Get('me/courses')
  @Roles('alumno', 'admin')
  async getMyCourses(@Request() req) {
    const user = await this.usersService.findOne(req.user.userId);
    return user?.courses;
  }

  // Alumno: ver detalle de un curso propio
  @Get('me/courses/:courseId')
  @Roles('alumno', 'admin')
  async getMyCourseDetail(@Request() req, @Param('courseId') courseId: string) {
    const user = await this.usersService.findOne(req.user.userId);
    const course = user?.courses?.find(c => c.id === Number(courseId));
    if (!course) {
      return { message: 'No tienes acceso a este curso' };
    }
    return course;
  }

  // Solo admin puede ver cualquier usuario por id
  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  // Solo admin puede crear usuarios
  @Post()
  @Roles('admin')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  // Solo admin puede actualizar usuarios
  @Put(':id')
  @Roles('admin')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(Number(id), body);
  }

  // Solo admin puede eliminar usuarios
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }
}
