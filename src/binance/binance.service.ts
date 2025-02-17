import { Injectable } from '@nestjs/common';
import { BinanceClient } from './binance.client';

@Injectable()
export class BinanceService {
  constructor(private readonly binanceClient: BinanceClient) {}

  public async getHistoricalMarketData(data: {
    symbol: string;
    startTime: Date;
    endTime: Date;
  }): Promise<void> {
    const { symbol, startTime, endTime } = data;

    const aggTrades = await this.binanceClient.aggTrades(
      symbol,
      startTime,
      endTime,
    );

    console.log(aggTrades);
  }
}
