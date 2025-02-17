import { Injectable } from '@nestjs/common';
import { BinanceService } from 'src/binance/binance.service';
import { AnalysisResultDto } from './dto/analysis-result.dto';
import { AnalyzeCryptoDataDto } from './dto/analyze-crypto-data.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly binanceService: BinanceService) {}

  public async analyzeCryptoData(
    dto: AnalyzeCryptoDataDto,
  ): Promise<AnalysisResultDto> {
    const historicalData = await this.binanceService.getHistoricalMarketData({
      symbol: dto.symbol,
      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),
    });

    console.log(historicalData);

    return {
      id: 1,
    };
  }
}
