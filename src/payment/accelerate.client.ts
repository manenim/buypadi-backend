import { Injectable, BadGatewayException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface TokenResponse {
  status: boolean;
  message: string;
  data: { token: string };
}

interface TicketRequest {
  pay_amount: number;
  reference: string;
  callback_url: string;
  description: string;
}

interface TicketResponse {
  success: boolean;
  message: string;
  data: {
    redirect_url: string;
    reference: string;
    session_token: string;
  };
}

@Injectable()
export class AccelerateClient {
  private readonly tokenURL: string;
  private readonly ticketURL: string;
  private readonly publicKey: string;
  private readonly secretKey: string;

  constructor(private readonly config: ConfigService) {
    this.tokenURL = config.getOrThrow<string>('TOKEN_URL');
    this.ticketURL = config.getOrThrow<string>('ACCELERATE_TICKET_URL');
    this.publicKey = config.getOrThrow<string>('ACCELERATE_API_PUBLIC_KEY');
    this.secretKey = config.getOrThrow<string>('ACCELERATE_API_SECRET_KEY');
  }

  async getAccessToken(): Promise<string> {
    const credentials = Buffer.from(`${this.publicKey}:${this.secretKey}`).toString('base64');
    let res: Response;
    try {
      res = await fetch(this.tokenURL, {
        headers: { Authorization: `Basic ${credentials}` },
      });
    } catch (err) {
      throw new BadGatewayException(
        `Accelerate token request failed: ${err instanceof Error ? err.message : 'network error'}`,
      );
    }

    if (!res.ok) {
      throw new BadGatewayException(`Accelerate token request failed: HTTP ${res.status}`);
    }

    let body: TokenResponse;
    try {
      body = (await res.json()) as TokenResponse;
    } catch {
      throw new BadGatewayException('Accelerate returned invalid JSON for token request');
    }

    if (!body.status) {
      throw new BadGatewayException(`Accelerate token error: ${body.message}`);
    }
    return body.data.token;
  }

  async createTicket(token: string, req: TicketRequest): Promise<string> {
    let res: Response;
    try {
      res = await fetch(this.ticketURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(req),
      });
    } catch (err) {
      throw new BadGatewayException(
        `Accelerate ticket request failed: ${err instanceof Error ? err.message : 'network error'}`,
      );
    }

    if (!res.ok) {
      throw new BadGatewayException(`Accelerate ticket request failed: HTTP ${res.status}`);
    }

    let body: TicketResponse;
    try {
      body = (await res.json()) as TicketResponse;
    } catch {
      throw new BadGatewayException('Accelerate returned invalid JSON for ticket request');
    }

    if (!body.success) {
      throw new BadGatewayException(`Accelerate ticket error: ${body.message}`);
    }

    const { redirect_url, session_token } = body.data;
    if (!redirect_url || !session_token) {
      throw new BadGatewayException('Accelerate response missing redirect_url or session_token');
    }

    return `${redirect_url}?ref=${session_token}`;
  }
}
