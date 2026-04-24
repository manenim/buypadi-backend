import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InspectionRequest, InspectionStatus } from './entities/inspection-request.entity';
import { CreateInspectionRequestDto } from './dto/create-inspection-request.dto';
import { UpdateInspectionRequestDto } from './dto/update-inspection-request.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class InspectionRequestsService {
  constructor(
    @InjectRepository(InspectionRequest)
    private readonly repo: Repository<InspectionRequest>,
    private readonly mailService: MailService,
  ) {}

  // ── Helpers ────────────────────────────────────────────────────────────────

  private generateOrderId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const suffix = Array.from({ length: 6 }, () =>
      chars[Math.floor(Math.random() * chars.length)],
    ).join('');
    return `BP-${suffix}`;
  }

  private async findByOrderIdOrFail(orderId: string): Promise<InspectionRequest> {
    const record = await this.repo.findOne({ where: { orderId } });
    if (!record) {
      throw new NotFoundException(`Inspection request ${orderId} not found`);
    }
    return record;
  }

  // ── CRUD ───────────────────────────────────────────────────────────────────

  async create(dto: CreateInspectionRequestDto): Promise<{ orderId: string }> {
    let orderId: string;
    let exists = true;

    while (exists) {
      orderId = this.generateOrderId();
      exists = !!(await this.repo.findOne({ where: { orderId } }));
    }

    const record = this.repo.create({ ...dto, orderId });
    await this.repo.save(record);

    // Fire-and-forget — don't block the response if email fails
    this.mailService.sendNewRequestNotification(record).catch(() => null);

    return { orderId };
  }

  async findAll(status?: InspectionStatus): Promise<InspectionRequest[]> {
    const where = status ? { status } : {};
    return this.repo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(orderId: string): Promise<InspectionRequest> {
    return this.findByOrderIdOrFail(orderId);
  }

  async update(
    orderId: string,
    dto: UpdateInspectionRequestDto,
  ): Promise<InspectionRequest> {
    const record = await this.findByOrderIdOrFail(orderId);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async updateStatus(
    orderId: string,
    dto: UpdateStatusDto,
  ): Promise<InspectionRequest> {
    const record = await this.findByOrderIdOrFail(orderId);
    record.status = dto.status;
    if (dto.assignedInspectorName !== undefined) {
      record.assignedInspectorName = dto.assignedInspectorName;
    }
    return this.repo.save(record);
  }

  async softDelete(orderId: string): Promise<void> {
    const record = await this.findByOrderIdOrFail(orderId);
    await this.repo.softRemove(record);
  }

  async updatePaymentConfirmed(orderId: string): Promise<void> {
    const record = await this.repo.findOne({ where: { orderId } });
    if (!record) return; // Don't throw — webhook should always return 200
    record.status = InspectionStatus.PAYMENT_CONFIRMED;
    await this.repo.save(record);
  }
}
