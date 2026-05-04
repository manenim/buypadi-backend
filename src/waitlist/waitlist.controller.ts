import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CreateWaitlistEntryDto } from './dto/create-waitlist-entry.dto';
import { UpdateWaitlistEntryDto } from './dto/update-waitlist-entry.dto';
import { WaitlistService } from './waitlist.service';

@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly service: WaitlistService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateWaitlistEntryDto) {
    const data = await this.service.create(dto);
    return {
      message: 'Joined waitlist successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return {
      message: 'Waitlist entries retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(id);
    return {
      message: 'Waitlist entry retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateWaitlistEntryDto) {
    const data = await this.service.update(id, dto);
    return {
      message: 'Waitlist entry updated successfully',
      data,
    };
  }
}
