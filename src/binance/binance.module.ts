import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { BinanceClient } from './binance.client';
import { BinanceService } from './binance.service';

@Module({
  imports: [HttpModule],
  providers: [BinanceClient, BinanceService],
  exports: [BinanceService],
})
export class BinanceModule {}
