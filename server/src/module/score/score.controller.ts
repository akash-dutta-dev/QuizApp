// score.controller.ts
import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { ScoreService } from './score.service';
import { SubmitScoreDto } from './dto/submit-score.dto';
import { AuthService } from '../auth/auth.service';
import { SubmitScoreResponseDto } from './dto/submit-score-response.dto';

@Controller('score')
export class ScoreController {
  constructor(
    private readonly scoreService: ScoreService,
    private readonly authService: AuthService,
  ) {}

  @Post('submit')
  async submitScore(
    @Body() createScoreDto: SubmitScoreDto,
    @Req() req: any,
  ): Promise<SubmitScoreResponseDto> {
    await this.authService.verifyTokenAndSetUser(req);
    const user = req.user;
    return this.scoreService.submitScore(createScoreDto, user);
  }
}
