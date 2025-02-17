import { Test } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { BinanceService } from 'src/binance/binance.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { BinanceClient } from 'src/binance/binance.client';
import { PeriodType } from './dto/analysis-result.dto';

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;
  let binanceService: BinanceService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [BinanceService, BinanceClient, AnalyticsService],
    }).compile();

    analyticsService = moduleRef.get(AnalyticsService);
    binanceService = moduleRef.get(BinanceService);
  });

  describe('getHistoricalMarketData', () => {
    const symbol = 'BTCUSDT';
    const endTime = '2025-02-17T10:00:00.000Z';
    const startTime = '2025-02-17T10:10:00.000Z';

    it('Should return no data if no data is found', async () => {
      const tradeData = [];
      jest
        .spyOn(binanceService, 'getHistoricalMarketData')
        .mockImplementation(async () => Promise.resolve(tradeData));

      const result = await analyticsService.analyzeCryptoData({
        symbol,
        endTime,
        startTime,
      });

      expect(result).toStrictEqual({
        symbol,
        lowestPrice: null,
        topPrice: null,
        periods: [],
      });

      expect(binanceService.getHistoricalMarketData).toHaveBeenCalledTimes(1);
    });

    it('Should return correct top and lowest price', async () => {
      const tradeData = [
        {
          aggregatedTradeId: 1,
          price: '1.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: new Date().getTime(),
          isBuyerMaker: true,
          isBestMatch: true,
        },
        {
          aggregatedTradeId: 1,
          price: '10.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: new Date().getTime(),
          isBuyerMaker: true,
          isBestMatch: true,
        },
        {
          aggregatedTradeId: 1,
          price: '0.002',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: new Date().getTime(),
          isBuyerMaker: true,
          isBestMatch: true,
        },
        {
          aggregatedTradeId: 1,
          price: '0.00002',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: new Date().getTime(),
          isBuyerMaker: true,
          isBestMatch: true,
        },
      ];
      jest
        .spyOn(binanceService, 'getHistoricalMarketData')
        .mockImplementation(async () => Promise.resolve(tradeData));

      const result = await analyticsService.analyzeCryptoData({
        symbol,
        endTime,
        startTime,
      });

      expect(result.lowestPrice).toBe('0.00002');
      expect(result.topPrice).toBe('10.0');

      expect(binanceService.getHistoricalMarketData).toHaveBeenCalledTimes(1);
    });

    it('Should return correct stable period', async () => {
      const tradeData = [
        {
          aggregatedTradeId: 1,
          price: '1.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 1,
          isBuyerMaker: true,
          isBestMatch: true,
        },
        {
          aggregatedTradeId: 1,
          price: '1.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 2,
          isBuyerMaker: true,
          isBestMatch: true,
        },
        {
          aggregatedTradeId: 1,
          price: '1.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 3,
          isBuyerMaker: true,
          isBestMatch: true,
        },
      ];
      jest
        .spyOn(binanceService, 'getHistoricalMarketData')
        .mockImplementation(async () => Promise.resolve(tradeData));

      const result = await analyticsService.analyzeCryptoData({
        symbol,
        endTime,
        startTime,
      });

      expect(result.periods.length).toBe(1);
      expect(result.periods[0]).toStrictEqual({
        startPrice: '1.0',
        endPrice: '1.0',
        startTime: 1,
        endTime: 3,
        periodType: PeriodType.STB,
      });

      expect(binanceService.getHistoricalMarketData).toHaveBeenCalledTimes(1);
    });

    it('Should return correct inc period', async () => {
      const tradeData = [
        {
          aggregatedTradeId: 1,
          price: '1.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 1,
          isBuyerMaker: true,
          isBestMatch: true,
        },
        {
          aggregatedTradeId: 1,
          price: '2.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 2,
          isBuyerMaker: true,
          isBestMatch: true,
        },
        {
          aggregatedTradeId: 1,
          price: '3.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 3,
          isBuyerMaker: true,
          isBestMatch: true,
        },
      ];
      jest
        .spyOn(binanceService, 'getHistoricalMarketData')
        .mockImplementation(async () => Promise.resolve(tradeData));

      const result = await analyticsService.analyzeCryptoData({
        symbol,
        endTime,
        startTime,
      });

      expect(result.periods.length).toBe(1);
      expect(result.periods[0]).toStrictEqual({
        startPrice: '1.0',
        endPrice: '3.0',
        startTime: 1,
        endTime: 3,
        periodType: PeriodType.INC,
      });

      expect(binanceService.getHistoricalMarketData).toHaveBeenCalledTimes(1);
    });

    it('Should return correct dec period', async () => {
      const tradeData = [
        {
          aggregatedTradeId: 1,
          price: '3.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 1,
          isBuyerMaker: true,
          isBestMatch: true,
        },
        {
          aggregatedTradeId: 1,
          price: '2.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 2,
          isBuyerMaker: true,
          isBestMatch: true,
        },
        {
          aggregatedTradeId: 1,
          price: '1.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 3,
          isBuyerMaker: true,
          isBestMatch: true,
        },
      ];
      jest
        .spyOn(binanceService, 'getHistoricalMarketData')
        .mockImplementation(async () => Promise.resolve(tradeData));

      const result = await analyticsService.analyzeCryptoData({
        symbol,
        endTime,
        startTime,
      });

      expect(result.periods.length).toBe(1);
      expect(result.periods[0]).toStrictEqual({
        startPrice: '3.0',
        endPrice: '1.0',
        startTime: 1,
        endTime: 3,
        periodType: PeriodType.DEC,
      });

      expect(binanceService.getHistoricalMarketData).toHaveBeenCalledTimes(1);
    });

    it('Should correctly switch between stb and inc', async () => {
      const tradeData = [
        {
          aggregatedTradeId: 1,
          price: '1.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 1,
          isBuyerMaker: true,
          isBestMatch: true,
        },
        {
          aggregatedTradeId: 1,
          price: '1.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 2,
          isBuyerMaker: true,
          isBestMatch: true,
        },
        {
          aggregatedTradeId: 1,
          price: '2.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 3,
          isBuyerMaker: true,
          isBestMatch: true,
        },
      ];
      jest
        .spyOn(binanceService, 'getHistoricalMarketData')
        .mockImplementation(async () => Promise.resolve(tradeData));

      const result = await analyticsService.analyzeCryptoData({
        symbol,
        endTime,
        startTime,
      });

      expect(result.periods.length).toBe(2);
      expect(result.periods[0]).toStrictEqual({
        startPrice: '1.0',
        endPrice: '1.0',
        startTime: 1,
        endTime: 2,
        periodType: PeriodType.STB,
      });
      expect(result.periods[1]).toStrictEqual({
        startPrice: '1.0',
        endPrice: '2.0',
        startTime: 2,
        endTime: 3,
        periodType: PeriodType.INC,
      });

      expect(binanceService.getHistoricalMarketData).toHaveBeenCalledTimes(1);
    });

    it('Should correctly switch between stb and dev', async () => {
      const tradeData = [
        {
          aggregatedTradeId: 1,
          price: '2.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 1,
          isBuyerMaker: true,
          isBestMatch: true,
        },
        {
          aggregatedTradeId: 1,
          price: '2.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 2,
          isBuyerMaker: true,
          isBestMatch: true,
        },
        {
          aggregatedTradeId: 1,
          price: '1.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 3,
          isBuyerMaker: true,
          isBestMatch: true,
        },
      ];
      jest
        .spyOn(binanceService, 'getHistoricalMarketData')
        .mockImplementation(async () => Promise.resolve(tradeData));

      const result = await analyticsService.analyzeCryptoData({
        symbol,
        endTime,
        startTime,
      });

      expect(result.periods.length).toBe(2);
      expect(result.periods[0]).toStrictEqual({
        startPrice: '2.0',
        endPrice: '2.0',
        startTime: 1,
        endTime: 2,
        periodType: PeriodType.STB,
      });
      expect(result.periods[1]).toStrictEqual({
        startPrice: '2.0',
        endPrice: '1.0',
        startTime: 2,
        endTime: 3,
        periodType: PeriodType.DEC,
      });

      expect(binanceService.getHistoricalMarketData).toHaveBeenCalledTimes(1);
    });

    it('Should correctly switch between inc, dec and inc ', async () => {
      const tradeData = [
        {
          aggregatedTradeId: 1,
          price: '1.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 1,
          isBuyerMaker: true,
          isBestMatch: true,
        },
        {
          aggregatedTradeId: 1,
          price: '2.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 2,
          isBuyerMaker: true,
          isBestMatch: true,
        },
        {
          aggregatedTradeId: 1,
          price: '3.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 3,
          isBuyerMaker: true,
          isBestMatch: true,
        },
        {
          aggregatedTradeId: 1,
          price: '2.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 4,
          isBuyerMaker: true,
          isBestMatch: true,
        },
        {
          aggregatedTradeId: 1,
          price: '1.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 5,
          isBuyerMaker: true,
          isBestMatch: true,
        },
        {
          aggregatedTradeId: 1,
          price: '2.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 6,
          isBuyerMaker: true,
          isBestMatch: true,
        },
        {
          aggregatedTradeId: 1,
          price: '3.0',
          quantity: '1.0',
          firstTradeId: 1,
          lastTradeId: 1,
          timestamp: 7,
          isBuyerMaker: true,
          isBestMatch: true,
        },
      ];
      jest
        .spyOn(binanceService, 'getHistoricalMarketData')
        .mockImplementation(async () => Promise.resolve(tradeData));

      const result = await analyticsService.analyzeCryptoData({
        symbol,
        endTime,
        startTime,
      });

      expect(result.periods.length).toBe(3);
      expect(result.periods[0]).toStrictEqual({
        startPrice: '1.0',
        endPrice: '3.0',
        startTime: 1,
        endTime: 3,
        periodType: PeriodType.INC,
      });
      expect(result.periods[1]).toStrictEqual({
        startPrice: '3.0',
        endPrice: '1.0',
        startTime: 3,
        endTime: 5,
        periodType: PeriodType.DEC,
      });
      expect(result.periods[2]).toStrictEqual({
        startPrice: '1.0',
        endPrice: '3.0',
        startTime: 5,
        endTime: 7,
        periodType: PeriodType.INC,
      });

      expect(binanceService.getHistoricalMarketData).toHaveBeenCalledTimes(1);
    });
  });
});
