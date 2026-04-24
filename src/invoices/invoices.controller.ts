import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceStatusDto } from './dto/update-invoice-status.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly service: InvoicesService) {}

  // POST /invoices
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateInvoiceDto) {
    const data = await this.service.create(dto);
    return { message: 'Invoice created successfully', data };
  }

  // GET /invoices
  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return { message: 'Invoices retrieved successfully', data };
  }

  // GET /invoices/by-token/:token  (must be before /:id)
  @Get('by-token/:token')
  async findByToken(@Param('token') token: string) {
    const data = await this.service.findByToken(token);
    return { message: 'Invoice retrieved successfully', data };
  }

  // GET /invoices/by-request/:requestId  (must be before /:id)
  @Get('by-request/:requestId')
  async findByRequestId(@Param('requestId') requestId: string) {
    const data = await this.service.findByRequestId(requestId);
    return { message: 'Invoice retrieved successfully', data };
  }

  // GET /invoices/:id
  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.service.findById(id);
    return { message: 'Invoice retrieved successfully', data };
  }

  // PATCH /invoices/:id/status
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceStatusDto,
  ) {
    const data = await this.service.updateStatus(id, dto);
    return { message: `Invoice status updated to ${data.status}`, data };
  }
}
