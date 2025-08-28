
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Solo admin puede ver todos los cursos
  @Get()
  @Roles('admin')
  findAll() {
    return this.coursesService.findAll();
  }

  // Solo admin puede ver cualquier curso por id
  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(Number(id));
  }

  @Put(':id/users/')
  @Roles('admin')
 assignUserToCourse(
    @Param('id') id: string,
    @Body() body: [],
  ) {
    return this.coursesService.addUserToCourse(Number(id), body);
  }

  // Solo admin puede crear cursos
  @Post()
  @Roles('admin')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() body: CreateCourseDto) {
    return this.coursesService.create(body);
  }

  // Solo admin puede actualizar cursos
  @Put(':id')
  @Roles('admin')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param('id') id: string, @Body() body: UpdateCourseDto) {
    return this.coursesService.update(Number(id), body);
  }

  // Solo admin puede eliminar cursos
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(Number(id));
  }
}
