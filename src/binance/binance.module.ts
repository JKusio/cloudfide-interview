import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { BinanceClient } from './binance.client';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [BinanceClient],
})
export class BinanceModule {}
