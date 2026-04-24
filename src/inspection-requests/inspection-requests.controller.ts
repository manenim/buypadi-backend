import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InspectionRequestsService } from './inspection-requests.service';
import { CreateInspectionRequestDto } from './dto/create-inspection-request.dto';
import { UpdateInspectionRequestDto } from './dto/update-inspection-request.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { InspectionStatus } from './entities/inspection-request.entity';

@Controller('inspection-requests')
export class InspectionRequestsController {
  constructor(private readonly service: InspectionRequestsService) {}

  // POST /api/inspection-requests
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateInspectionRequestDto) {
    const data = await this.service.create(dto);
    return {
      message: 'Inspection request submitted successfully',
      data,
    };
  }

  // GET /api/inspection-requests?status=pending
  @Get()
  async findAll(@Query('status') status?: InspectionStatus) {
    const data = await this.service.findAll(status);
    return {
      message: 'Inspection requests retrieved successfully',
      data,
    };
  }

  // GET /api/inspection-requests/:orderId
  @Get(':orderId')
  async findOne(@Param('orderId') orderId: string) {
    const data = await this.service.findOne(orderId);
    return {
      message: 'Inspection request retrieved successfully',
      data,
    };
  }

  // PATCH /api/inspection-requests/:orderId
  @Patch(':orderId')
  async update(
    @Param('orderId') orderId: string,
    @Body() dto: UpdateInspectionRequestDto,
  ) {
    const data = await this.service.update(orderId, dto);
    return {
      message: 'Inspection request updated successfully',
      data,
    };
  }

  // PATCH /api/inspection-requests/:orderId/status
  @Patch(':orderId/status')
  async updateStatus(
    @Param('orderId') orderId: string,
    @Body() dto: UpdateStatusDto,
  ) {
    const data = await this.service.updateStatus(orderId, dto);
    return {
      message: `Status updated to ${data.status}`,
      data,
    };
  }

  // DELETE /api/inspection-requests/:orderId
  @Delete(':orderId')
  @HttpCode(HttpStatus.OK)
  async softDelete(@Param('orderId') orderId: string) {
    await this.service.softDelete(orderId);
    return {
      message: 'Inspection request deleted successfully',
      data: null,
    };
  }
}
