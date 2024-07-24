import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from 'src/module/score/entity/score.entity';

import { Question } from 'src/module/question/entity/question.entity';
import { SubmitScoreResponseDto } from './dto/submit-score-response.dto';
import { JwtUserDto } from '../user/dto/jwt-user.dto';
import { User } from '../user/entities/user.entity';
import { Topic } from '../topic/entities/topic.entity';
import { SubmitScoreDto } from './dto/submit-score.dto';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async submitScore(
    sumbitScoreDto: SubmitScoreDto,
    user: JwtUserDto,
  ): Promise<SubmitScoreResponseDto> {
    const userSaved = await this.userRepository.findOne({
      where: { id: user.sub },
    });
    const topicSaved = await this.topicRepository.findOne({
      where: { id: sumbitScoreDto.topicId },
    });

    const questions = await this.questionRepository.findByIds(
      sumbitScoreDto.answers.map((answer) => answer.questionId),
    );

    let totalScore = 0;
    let totalQuestions = questions.length;

    // Determine the score
    const updatedQuestions = questions.map((question) => {
      const answer = sumbitScoreDto.answers.find(
        (a) => a.questionId === question.id,
      );
      if (answer) {
        if (answer.answer === question.correctOption) {
          totalScore++;
        }
        return { ...question, answer: answer.answer };
      }
      return { ...question, answer: '' };
    });

    const existingScore = await this.scoreRepository.findOne({
      where: { user: userSaved, topic: topicSaved },
    });

    if (!existingScore) {
      userSaved.topicsAttempted += 1;
    }

    // Update the user's score and statistics
    await this.userRepository.update(user.sub, {
      totalCorrectlyAnswered: userSaved.totalCorrectlyAnswered + totalScore,
      totalQuestionAttempted: userSaved.totalQuestionAttempted + totalQuestions,
      topicsAttempted: userSaved.topicsAttempted,
    });

    const score = this.scoreRepository.create({
      user: userSaved,
      answers: sumbitScoreDto.answers,
      topic: topicSaved,
      totalScore,
      totalQuestion: totalQuestions,
    });

    await this.scoreRepository.save(score);

    // Return the formatted response
    return {
      questions: updatedQuestions,
      totalQuestion: totalQuestions,
      totalCorrect: totalScore,
    };
  }
}
