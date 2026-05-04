import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CreateQuestionnaireResponseDto } from './dto/create-questionnaire-response.dto';
import { UpdateQuestionnaireResponseDto } from './dto/update-questionnaire-response.dto';
import { QuestionnaireService } from './questionnaire.service';

@Controller('questionnaire-responses')
export class QuestionnaireController {
  constructor(private readonly service: QuestionnaireService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateQuestionnaireResponseDto) {
    const data = await this.service.create(dto);
    return {
      message: 'Questionnaire submitted successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return {
      message: 'Questionnaire responses retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(id);
    return {
      message: 'Questionnaire response retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateQuestionnaireResponseDto,
  ) {
    const data = await this.service.update(id, dto);
    return {
      message: 'Questionnaire response updated successfully',
      data,
    };
  }
}
