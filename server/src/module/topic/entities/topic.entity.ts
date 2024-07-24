import { Question } from 'src/module/question/entity/question.entity';
import { Score } from 'src/module/score/entity/score.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  topic: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Question, (question) => question.topic)
  questions: Question[];

  @OneToMany(() => Score, (score) => score.topic)
  score: Score[];
}
