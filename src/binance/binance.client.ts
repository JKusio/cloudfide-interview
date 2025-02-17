import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/config/config';
import { BinanceAggTradeDto } from './dto/binance-agg-trade.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class BinanceClient {
  private readonly baseUrl: string;
  private readonly logger = new Logger(BinanceClient.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseUrl = this.configService.get<string>(Config.BinanceApiUrl)!;
  }

  public async aggTrades(
    symbol: string,
    startTime?: Date,
    endTime?: Date,
    limit: number = 500,
    fromId?: number,
  ): Promise<Array<BinanceAggTradeDto>> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<
          Array<{
            a: number;
            p: string;
            q: string;
            f: number;
            l: number;
            T: number;
            m: boolean;
            M: boolean;
          }>
        >(`${this.baseUrl}/api/v3/aggTrades`, {
          params: {
            symbol,
            startTime: startTime?.getTime(),
            endTime: endTime?.getTime(),
            limit,
            fromId,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw new Error('Error while trying to get aggTrades');
          }),
        ),
    );

    const result: Array<BinanceAggTradeDto> = data.map((res) => ({
      aggregatedTradeId: res.a,
      price: res.p,
      quantity: res.q,
      firstTradeId: res.f,
      lastTradeId: res.l,
      timestamp: res.T,
      isBuyerMaker: res.m,
      isBestMatch: res.M,
    }));

    return result;
  }
}
