import { Question } from 'src/module/question/entity/question.entity';

export class SubmitScoreResponseDto {
  questions: Question[];
  totalQuestion: number;
  totalCorrect: number;
}
