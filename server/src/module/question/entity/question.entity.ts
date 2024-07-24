import { Topic } from 'src/module/topic/entities/topic.entity';
import { User } from 'src/module/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column('simple-array')
  options: string[];

  @Column({ nullable: true })
  correctOption: string;

  @ManyToOne(() => User, (user) => user.questions)
  user: User;

  @ManyToOne(() => Topic, (topic) => topic.questions)
  topic: Topic;
}
