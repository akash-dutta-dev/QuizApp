import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { TopicToGenerateQuestion } from '../topic/dto/topic-to-generate.dto';
import { AuthService } from '../auth/auth.service';

@Controller('question')
export class QuestionController {
  constructor(
    private readonly authService: AuthService,
    private readonly questionService: QuestionService,
  ) {}

  @Post('generateQuestion')
  async generateQuestions(
    @Body() topic: TopicToGenerateQuestion,
    @Request() req: any,
  ) {
    await this.authService.verifyTokenAndSetUser(req);
    const user = req.user;
    return this.questionService.generateQuestions(topic, user);
    return this.questionService.getQuestions();
  }
}
