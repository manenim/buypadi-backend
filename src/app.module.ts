import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InspectionRequestsModule } from "./inspection-requests/inspection-requests.module";
import { InspectionRequest } from "./inspection-requests/entities/inspection-request.entity";
import { Invoice } from "./invoices/entities/invoice.entity";
import { InvoicesModule } from "./invoices/invoices.module";
import { PaymentModule } from "./payment/payment.module";
import { UploadModule } from "./upload/upload.module";
import { MailModule } from "./mail/mail.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get<string>("DB_HOST", "localhost"),
        port: config.get<number>("DB_PORT", 5432),
        username: config.get<string>("DB_USERNAME", "postgres"),
        password: config.get<string>("DB_PASSWORD", "agoodpassword"),
        database: config.get<string>("DB_NAME", "buypady"),
        entities: [InspectionRequest, Invoice],
        synchronize: config.get<string>("NODE_ENV") !== "production",
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    InspectionRequestsModule,
    InvoicesModule,
    PaymentModule,
    UploadModule,
    MailModule,
  ],
})
export class AppModule {}
