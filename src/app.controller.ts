import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BinanceService } from './binance/binance.service';
import { sub } from 'date-fns';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly binanceService: BinanceService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    const now = new Date();
    const sevenDaysAgo = sub(now, { minutes: 1 });

    await this.binanceService.getHistoricalMarketData({
      symbol: 'BTCUSDT',
      startTime: sevenDaysAgo,
      endTime: now,
    });

    return this.appService.getHello();
  }
}
