import { Module } from '@nestjs/common';
import { BinanceModule } from 'src/binance/binance.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [BinanceModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [],
})
export class AnalyticsModule {}
