import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionnaireResponseDto } from './dto/create-questionnaire-response.dto';
import { UpdateQuestionnaireResponseDto } from './dto/update-questionnaire-response.dto';
import { QuestionnaireResponse } from './entities/questionnaire-response.entity';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(QuestionnaireResponse)
    private readonly repo: Repository<QuestionnaireResponse>,
  ) {}

  async create(dto: CreateQuestionnaireResponseDto): Promise<QuestionnaireResponse> {
    const record = this.repo.create({
      ...dto,
      tradeCategoryOther: dto.tradeCategoryOther ?? null,
      currentPlatformOther: dto.currentPlatformOther ?? null,
      lossAmount: dto.lossAmount ?? null,
      biggestIssueOther: dto.biggestIssueOther ?? null,
    });
    return this.repo.save(record);
  }

  async findAll(): Promise<QuestionnaireResponse[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<QuestionnaireResponse> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Questionnaire response ${id} not found`);
    }
    return record;
  }

  async update(
    id: string,
    dto: UpdateQuestionnaireResponseDto,
  ): Promise<QuestionnaireResponse> {
    const record = await this.findOne(id);
    Object.assign(record, {
      ...dto,
      adminNotes: dto.adminNotes === undefined ? record.adminNotes : dto.adminNotes || null,
    });
    return this.repo.save(record);
  }
}
