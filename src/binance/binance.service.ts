import { Injectable } from '@nestjs/common';
import { BinanceClient } from './binance.client';
import { BinanceAggTradeDto } from './dto/binance-agg-trade.dto';

const BATCH_LIMIT = 500;
@Injectable()
export class BinanceService {
  constructor(private readonly binanceClient: BinanceClient) {}

  public async getHistoricalMarketData(data: {
    symbol: string;
    startTime: Date;
    endTime: Date;
  }): Promise<Array<BinanceAggTradeDto>> {
    const { symbol, startTime, endTime } = data;

    const aggTrades = await this.binanceClient.aggTrades(
      symbol,
      startTime,
      endTime,
      BATCH_LIMIT,
    );

    let allTrades = [...aggTrades];

    if (aggTrades.length === BATCH_LIMIT) {
      while (true) {
        const nextBatch = await this.binanceClient.aggTrades(
          symbol,
          new Date(allTrades[allTrades.length - 1].timestamp + 1),
          endTime,
          BATCH_LIMIT,
        );

        allTrades = allTrades.concat(nextBatch);

        if (nextBatch.length < BATCH_LIMIT) {
          break;
        }
      }
    }

    return allTrades;
  }
}
