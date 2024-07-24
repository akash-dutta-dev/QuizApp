// src/users/user.entity.ts
import { Question } from 'src/module/question/entity/question.entity';
import { Score } from 'src/module/score/entity/score.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

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

  @Column({ type: 'varchar', length: 6, default: '123456' })
  otp: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: 0 })
  topicsAttempted: number;

  @Column({ default: 0 })
  totalCorrectlyAnswered: number;

  @Column({ default: 0 })
  totalQuestionAttempted: number;

  @OneToMany(() => Question, (question) => question.user)
  questions: Question[];

  @OneToMany(() => Score, (score) => score.user)
  score: Score[];
}
