



import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  /**
   * Asigna un curso a un usuario (solo admin)
   */
  @Post(':id/courses/:courseId')
  @Roles('admin')
  @ApiOperation({ summary: 'Asignar un curso a un usuario' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', description: 'ID del usuario' })
  @ApiParam({ name: 'courseId', type: 'string', description: 'ID del curso' })
  @ApiResponse({ status: 200, description: 'Curso asignado correctamente.' })
  @ApiResponse({ status: 404, description: 'Usuario o curso no encontrado.' })
  async assignCourseToUser(
    @Param('id') id: string,
    @Param('courseId') courseId: string,
  ) {
    // addCourse espera números
    return this.usersService.addCourse(Number(id), Number(courseId));
  }
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
    return this.usersService.findOne(id);
  }

  // Solo admin puede crear usuarios
  @Post()
  @Roles('admin')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() body: CreateUserDto) {


    try {
      const resp = await this.usersService.create(body);
      console.log('Usuario creado:', resp);
      return {
        status: 'success',
        code: 'USER_CREATED',
        payload: { id: resp.id },
      };
    } catch (error) {
      console.log('Error al crear usuario controller:', error);
      return { error: 'Error al crear usuario', message: error.message };
    }
    
  }

  // Solo admin puede actualizar usuarios
  @Put(':id')
  @Roles('admin')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  // Solo admin puede eliminar usuarios
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
