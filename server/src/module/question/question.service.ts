import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entity/question.entity';
import { Topic } from '../topic/entities/topic.entity';
import { JwtUserDto } from '../user/dto/jwt-user.dto';
import { TopicToGenerateQuestion } from '../topic/dto/topic-to-generate.dto';
import { OpenAI } from 'openai';
import { User } from '../user/entities/user.entity';
import { config } from 'dotenv';

config();

@Injectable()
export class QuestionService {
  private openai: OpenAI;

  private readonly CHATGPT_API_KEY = process.env.CHATGPT_API_KEY;
  private readonly CHATGPT_MODEL = process.env.CHATGPT_MODEL;

  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.openai = new OpenAI({
      apiKey: this.CHATGPT_API_KEY,
    });
  }

  async generateQuestions(
    topic: TopicToGenerateQuestion,
    user: JwtUserDto,
  ): Promise<Question[]> {
    let topicSaved = await this.topicRepository.findOne({
      where: { topic: topic.topic },
    });
    let userSaved = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (!topicSaved) {
      throw new BadRequestException('Topic not found');
    }

    // Create the prompt
    const prompt = `Imagine you are a quizmaster. Create 10 MCQs on the topic "${topic.topic}" which covers the description: "${topic.description}". Each question should have 4 options and one correct option. Reply in JSON format like [{"question": "Your question?", "options": ["Option1", "Option2", "Option3", "Option4"], "correctOption": "Option1"}]. Your response will directly be stored in a variable, so generate accordingly`;

    // Call OpenAI to generate questions
    let generatedQuestions;
    try {
      const response = await this.openai.chat.completions.create({
        model: this.CHATGPT_MODEL,
        messages: [{ role: 'system', content: prompt }],
        temperature: 1,
        max_tokens: 1500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      let responseText = response.choices[0].message.content.trim();

      // Handle cases where there might be single backticks
      responseText = responseText.replace(/`/g, '').trim();

      // Remove only the first occurrence of the word 'json' if present
      responseText = responseText.replace(/\bjson\b/i, '').trim();

      try {
        generatedQuestions = JSON.parse(responseText);
      } catch (jsonError) {
        throw new BadRequestException(
          'Error parsing JSON response from OpenAI',
        );
      }
    } catch (error) {
      console.error('Error fetching data from OpenAI:', error.message);
      throw new Error('Error fetching data from OpenAI');
    }
    // Save the generated questions to the database
    const questions: Question[] = [];
    for (const genQuestion of generatedQuestions) {
      const question = this.questionRepository.create({
        question: genQuestion.question,
        options: genQuestion.options,
        correctOption: genQuestion.correctOption,
        user: userSaved,
        topic: topicSaved,
      });

      const savedQuestion = await this.questionRepository.save(question);
      delete savedQuestion.user;
      delete savedQuestion.topic;
      delete savedQuestion.correctOption;
      questions.push(savedQuestion);
    }

    return questions;
  }

  async getQuestions(): Promise<Omit<Question, 'correctOption'>[]> {
    const questions = await this.questionRepository.find({
      take: 5,
      order: {
        id: 'DESC',
      },
    });

    return questions.map(({ correctOption, ...rest }) => rest);
  }
}
