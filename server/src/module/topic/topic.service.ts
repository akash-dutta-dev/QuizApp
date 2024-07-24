import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}

  async findAll(): Promise<Topic[]> {
    return this.topicRepository.find();
  }

  async insertTopics(topics: Partial<Topic>[]): Promise<string> {
    for (const topic of topics) {
      const createdTopic = this.topicRepository.create(topic);
      await this.topicRepository.save(createdTopic);
    }
    return 'Seed completed'; // Return the completion message
  }
}
