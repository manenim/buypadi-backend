import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Invoice, InvoiceStatus } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceStatusDto } from './dto/update-invoice-status.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly repo: Repository<Invoice>,
  ) {}

  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.repo.count({
      where: { invoiceNumber: Like(`INV-${year}-%`) },
    });
    return `INV-${year}-${String(count + 1).padStart(3, '0')}`;
  }

  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    const total = Number(dto.inspectionFee) + Number(dto.deliveryFee);
    const invoiceNumber = await this.generateInvoiceNumber();

    const invoice = this.repo.create({
      token: randomUUID(),
      invoiceNumber,
      requestId: dto.requestId,
      orderId: dto.orderId,
      inspectionFee: dto.inspectionFee,
      deliveryFee: dto.deliveryFee,
      total,
      dueDate: new Date(dto.dueDate),
      notes: dto.notes ?? null,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail ?? null,
      customerWhatsapp: dto.customerWhatsapp,
      status: InvoiceStatus.UNPAID,
    });

    return this.repo.save(invoice);
  }

  async findAll(): Promise<Invoice[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Invoice> {
    const invoice = await this.repo.findOne({ where: { id } });
    if (!invoice) throw new NotFoundException(`Invoice ${id} not found`);
    return invoice;
  }

  async findByToken(token: string): Promise<Invoice> {
    const invoice = await this.repo.findOne({ where: { token } });
    if (!invoice) throw new NotFoundException(`Invoice not found`);
    return invoice;
  }

  async findByRequestId(requestId: string): Promise<Invoice | null> {
    return this.repo.findOne({ where: { requestId } });
  }

  async updateStatus(id: string, dto: UpdateInvoiceStatusDto): Promise<Invoice> {
    const invoice = await this.findById(id);
    invoice.status = dto.status;
    return this.repo.save(invoice);
  }

  async markPaidByReference(transactionReference: string): Promise<Invoice> {
    const invoice = await this.repo.findOne({ where: { transactionReference } });
    if (!invoice) throw new NotFoundException(`No invoice for reference ${transactionReference}`);
    if (invoice.status === InvoiceStatus.PAID) return invoice; // idempotent
    invoice.status = InvoiceStatus.PAID;
    return this.repo.save(invoice);
  }

  async setTransactionReference(id: string, reference: string): Promise<void> {
    await this.repo.update(id, { transactionReference: reference });
  }
}
