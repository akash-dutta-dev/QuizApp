import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { Score } from './entity/score.entity';
import { User } from '../user/entities/user.entity';
import { Topic } from '../topic/entities/topic.entity';
import { Question } from '../question/entity/question.entity';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Score, User, Topic, Question]),
    AuthModule,
  ],
  providers: [ScoreService],
  controllers: [ScoreController],
})
export class ScoreModule {}
