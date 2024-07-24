import { Controller, Get, Post } from '@nestjs/common';
import { TopicService } from './topic.service';
import { topics } from './topics'; // Import the array of topics
import { Topic } from './entities/topic.entity';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get('all')
  async getAllTopics(): Promise<Topic[]> {
    return this.topicService.findAll();
  }

  @Post('seed')
  async seedTopics(): Promise<string> {
    //await this.topicService.insertTopics(topics);
    return 'Topics seeded successfully';
  }
}
