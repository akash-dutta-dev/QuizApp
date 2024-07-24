import { Topic } from 'src/module/topic/entities/topic.entity';
import { User } from 'src/module/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.score)
  user: User;

  @Column('jsonb')
  answers: { questionId: number; answer: string }[];

  @Column()
  totalScore: number;

  @Column()
  totalQuestion: number;

  @ManyToOne(() => Topic, (topic) => topic.score)
  topic: Topic;
}
