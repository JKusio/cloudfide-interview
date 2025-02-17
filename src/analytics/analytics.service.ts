import { Injectable } from '@nestjs/common';
import { BinanceService } from 'src/binance/binance.service';
import {
  AnalysisResultDto,
  PeriodDto,
  PeriodType,
} from './dto/analysis-result.dto';
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

    let topPrice = historicalData[0].price;
    let lowestPrice = historicalData[0].price;
    const periods: Array<PeriodDto> = [];

    let periodStartPrice = historicalData[0].price;
    let periodStartTime = historicalData[0].timestamp;
    let periodType: PeriodType | null = null;

    let previousPrice = historicalData[0].price;
    let previousTimestamp = historicalData[0].timestamp;

    historicalData.splice(0, 1);

    for (const { price, timestamp } of historicalData) {
      if (topPrice < price) {
        topPrice = price;
      }

      if (lowestPrice > price) {
        lowestPrice = price;
      }

      if (periodType === null) {
        if (price === periodStartPrice) {
          periodType = PeriodType.STB;
        } else if (price > periodStartPrice) {
          periodType = PeriodType.INC;
        } else if (price < periodStartPrice) {
          periodType = PeriodType.DEC;
        }
      } else {
        if (periodType === PeriodType.STB) {
          if (price !== periodStartPrice) {
            periods.push({
              startPrice: periodStartPrice,
              endPrice: price,
              startTime: periodStartTime,
              endTime: timestamp,
              periodType,
            });

            periodType =
              price > periodStartPrice ? PeriodType.INC : PeriodType.DEC;

            periodStartPrice = price;
            periodStartTime = timestamp;
          }
        } else if (periodType === PeriodType.INC) {
          if (price <= previousPrice) {
            periods.push({
              startPrice: periodStartPrice,
              endPrice: price,
              startTime: periodStartTime,
              endTime: timestamp,
              periodType,
            });

            periodType =
              price === previousPrice ? PeriodType.STB : PeriodType.DEC;

            periodStartPrice = previousPrice;
            periodStartTime = previousTimestamp;
          }
        } else if (periodType === PeriodType.DEC) {
          if (price >= previousPrice) {
            periods.push({
              startPrice: periodStartPrice,
              endPrice: price,
              startTime: periodStartTime,
              endTime: timestamp,
              periodType,
            });

            periodType =
              price === previousPrice ? PeriodType.STB : PeriodType.INC;

            periodStartPrice = previousPrice;
            periodStartTime = previousTimestamp;
          }
        }
      }

      previousPrice = price;
      previousTimestamp = timestamp;
    }

    return {
      symbol: dto.symbol,
      topPrice,
      lowestPrice,
      periods,
    };
  }
}
