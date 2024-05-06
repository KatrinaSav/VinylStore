import { ConfigService } from '@nestjs/config';
import { SentMessageInfo, Transporter, createTransport } from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { VinylRecordPaymentEvent } from './send-email-event.class';
import { PAYMENT } from '../constants';

@Injectable()
export class SendEmailListener {
  private readonly transporter: Transporter<SentMessageInfo>;
  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }
  @OnEvent(PAYMENT, { async: true })
  sendEmail({ to, subject, text }: VinylRecordPaymentEvent): void {
    this.transporter
      .sendMail({
        from: this.configService.get('SMTP_FROM'),
        to,
        subject,
        text,
      })
      .catch((err) => console.log(err));
  }
}
