import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum InvoiceStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  token: string;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column()
  requestId: string;

  @Column()
  orderId: string;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.UNPAID })
  status: InvoiceStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  inspectionFee: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  deliveryFee: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total: number;

  @Column({ type: 'timestamptz' })
  dueDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column()
  customerName: string;

  @Column({ nullable: true })
  customerEmail: string | null;

  @Column()
  customerWhatsapp: string;

  @Column({ nullable: true })
  transactionReference: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
