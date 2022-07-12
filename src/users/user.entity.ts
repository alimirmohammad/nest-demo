import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

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
