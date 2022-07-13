import { Report } from '../reports/report.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('user created with id: ' + this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('user updated with id: ' + this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('user removed with id: ' + this.id);
  }
}
