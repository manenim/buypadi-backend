import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWaitlistEntryDto } from './dto/create-waitlist-entry.dto';
import { UpdateWaitlistEntryDto } from './dto/update-waitlist-entry.dto';
import { WaitlistEntry } from './entities/waitlist-entry.entity';

@Injectable()
export class WaitlistService {
  constructor(
    @InjectRepository(WaitlistEntry)
    private readonly repo: Repository<WaitlistEntry>,
  ) {}

  async create(dto: CreateWaitlistEntryDto): Promise<WaitlistEntry> {
    const record = this.repo.create(dto);
    return this.repo.save(record);
  }

  async findAll(): Promise<WaitlistEntry[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<WaitlistEntry> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Waitlist entry ${id} not found`);
    }
    return record;
  }

  async update(id: string, dto: UpdateWaitlistEntryDto): Promise<WaitlistEntry> {
    const record = await this.findOne(id);
    Object.assign(record, {
      ...dto,
      adminNotes: dto.adminNotes === undefined ? record.adminNotes : dto.adminNotes || null,
    });
    return this.repo.save(record);
  }
}
