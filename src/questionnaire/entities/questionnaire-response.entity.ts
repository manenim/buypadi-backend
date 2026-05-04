import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum QuestionnaireLeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  CONVERTED = 'converted',
  NOT_INTERESTED = 'not_interested',
}

export enum UserType {
  BUYER = 'buyer',
  SELLER = 'seller',
  BOTH = 'both',
}

export enum TernaryAnswer {
  YES = 'yes',
  MAYBE = 'maybe',
  NO = 'no',
}

export enum ScamExperience {
  YES = 'yes',
  NO = 'no',
  ALMOST = 'almost',
}

@Entity('questionnaire_responses')
export class QuestionnaireResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: QuestionnaireLeadStatus, default: QuestionnaireLeadStatus.NEW })
  leadStatus: QuestionnaireLeadStatus;

  @Column({ type: 'enum', enum: UserType })
  userType: UserType;

  @Column('simple-array')
  tradeCategories: string[];

  @Column({ nullable: true })
  tradeCategoryOther: string | null;

  @Column()
  currentPlatform: string;

  @Column({ nullable: true })
  currentPlatformOther: string | null;

  @Column({ type: 'text' })
  platformPreferenceReason: string;

  @Column({ type: 'enum', enum: ScamExperience })
  scamExperience: ScamExperience;

  @Column({ nullable: true })
  lossAmount: string | null;

  @Column()
  biggestIssue: string;

  @Column({ nullable: true })
  biggestIssueOther: string | null;

  @Column()
  biggestFear: string;

  @Column({ type: 'enum', enum: TernaryAnswer })
  escrowInterest: TernaryAnswer;

  @Column()
  maxFee: string;

  @Column()
  deliveryTime: string;

  @Column()
  deliveryFrustration: string;

  @Column()
  transactionCompletionTime: string;

  @Column({ type: 'text' })
  transactionSlowdown: string;

  @Column('simple-array')
  trustFeatures: string[];

  @Column({ type: 'enum', enum: TernaryAnswer })
  payExtraForInspection: TernaryAnswer;

  @Column()
  likelihoodToUse: string;

  @Column({ type: 'text' })
  immediateUseReason: string;

  @Column()
  fullName: string;

  @Column()
  phoneNumber: string;

  @Column()
  city: string;

  @Column({ type: 'int', default: 1 })
  freeInspectionCredits: number;

  @Column({ type: 'int', default: 1 })
  freeDeliveryCredits: number;

  @Column({ type: 'text', nullable: true })
  adminNotes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
