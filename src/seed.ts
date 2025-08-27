import { DataSource } from 'typeorm';
import { User, UserRole } from './entity/user.entity';
import { Course } from './entity/course.entity';
import * as bcrypt from 'bcryptjs';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'one_api',
  password: '123456',
  database: 'one_rest_api',
  entities: [User, Course],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();

  // Crear cursos
  const course1 = AppDataSource.manager.create(Course, { name: 'Matemáticas', description: 'Curso de matemáticas básicas' });
  const course2 = AppDataSource.manager.create(Course, { name: 'Historia', description: 'Curso de historia universal' });
  await AppDataSource.manager.save([course1, course2]);

  // Crear usuarios
  const adminPassword = await bcrypt.hash('Admin123', 10);
  const alumnoPassword = await bcrypt.hash('Alumno123', 10);

  const admin = AppDataSource.manager.create(User, {
    name: 'Admin',
    email: 'admin@test.com',
    password: adminPassword,
    role: UserRole.ADMIN,
    courses: [course1, course2],
  });
  const alumno = AppDataSource.manager.create(User, {
    name: 'Alumno',
    email: 'alumno@test.com',
    password: alumnoPassword,
    role: UserRole.ALUMNO,
    courses: [course1],
  });
  await AppDataSource.manager.save([admin, alumno]);

  console.log('Datos de prueba insertados');
  await AppDataSource.destroy();
}

seed();
