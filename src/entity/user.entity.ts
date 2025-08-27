import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Course } from './course.entity';


export enum UserRole {
  ADMIN = 'admin',
  ALUMNO = 'alumno',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.ALUMNO })
  role: UserRole;

  @ManyToMany(() => Course, (course) => course.users, { cascade: true })
  @JoinTable()
  courses: Course[];
}
