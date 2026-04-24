import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum InspectionStatus {
  PENDING = 'pending',                         // Request received, awaiting payment
  PAYMENT_CONFIRMED = 'payment_confirmed',     // Payment verified
  SCHEDULED = 'scheduled',                     // Inspection time booked
  INSPECTOR_EN_ROUTE = 'inspector_en_route',   // Inspector heading to seller
  COMPLETED = 'completed',                     // Inspection done, report ready
  CANCELLED = 'cancelled',
}

@Entity('inspection_requests')
export class InspectionRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderId: string;

  // Item info
  @Column({ nullable: true })
  productLink: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  itemPrice: number;

  @Column({ nullable: true, type: 'text' })
  comments: string;

  @Column({ nullable: true })
  screenshotUrl: string;

  // Buyer info
  @Column()
  buyerFullName: string;

  @Column()
  buyerWhatsapp: string;

  @Column()
  buyerEmail: string;

  // Seller info
  @Column()
  sellerName: string;

  @Column()
  sellerPhone: string;

  @Column({ type: 'text' })
  sellerAddress: string;

  // Tracking
  @Column({
    type: 'enum',
    enum: InspectionStatus,
    default: InspectionStatus.PENDING,
  })
  status: InspectionStatus;

  @Column({ nullable: true })
  assignedInspectorName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
