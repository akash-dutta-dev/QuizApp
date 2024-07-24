// create-score.dto.ts
import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

class Answer {
  @IsNumber()
  questionId: number;

  @IsString()
  answer: string;
}

export class SubmitScoreDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Answer)
  answers: Answer[];

  @IsNotEmpty()
  @IsNumber()
  topicId: number;
}
