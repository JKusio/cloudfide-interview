import { Test } from '@nestjs/testing';
import { BinanceService } from './binance.service';
import { BinanceClient } from './binance.client';
import { sub } from 'date-fns';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

describe('BinanceService', () => {
  let binanceService: BinanceService;
  let binanceClient: BinanceClient;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [BinanceService, BinanceClient],
    }).compile();

    binanceService = moduleRef.get(BinanceService);
    binanceClient = moduleRef.get(BinanceClient);
  });

  describe('getHistoricalMarketData', () => {
    const symbol = 'BTCUSDT';
    const endTime = new Date();
    const startTime = sub(new Date(), { minutes: 10 });

    it('Should return empty array if no data is found', async () => {
      const expectedResult = [];
      jest
        .spyOn(binanceClient, 'aggTrades')
        .mockImplementation(async () => Promise.resolve(expectedResult));

      const result = await binanceService.getHistoricalMarketData({
        symbol,
        endTime,
        startTime,
      });

      expect(result).toStrictEqual(expectedResult);
      expect(binanceClient.aggTrades).toHaveBeenCalledTimes(1);
    });

    it('Should return 1 element correctly', async () => {
      const expectedResult = [
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
      ];

      jest
        .spyOn(binanceClient, 'aggTrades')
        .mockImplementation(async () => Promise.resolve(expectedResult));

      const result = await binanceService.getHistoricalMarketData({
        symbol,
        endTime,
        startTime,
      });

      expect(result).toStrictEqual(expectedResult);
      expect(binanceClient.aggTrades).toHaveBeenCalledTimes(1);
    });

    it('Should return 499 elements correctly', async () => {
      const expectedResult = new Array(499).fill(null).map((_, i) => ({
        aggregatedTradeId: i,
        price: '1.0',
        quantity: '1.0',
        firstTradeId: i,
        lastTradeId: i,
        timestamp: new Date().getTime(),
        isBuyerMaker: true,
        isBestMatch: true,
      }));

      jest
        .spyOn(binanceClient, 'aggTrades')
        .mockImplementation(async () => Promise.resolve(expectedResult));

      const result = await binanceService.getHistoricalMarketData({
        symbol,
        endTime,
        startTime,
      });

      expect(result).toStrictEqual(expectedResult);
      expect(binanceClient.aggTrades).toHaveBeenCalledTimes(1);
    });

    it('Should get additional data when there is 500 elements', async () => {
      const expectedResult = new Array(500).fill(null).map((_, i) => ({
        aggregatedTradeId: i,
        price: '1.0',
        quantity: '1.0',
        firstTradeId: i,
        lastTradeId: i,
        timestamp: new Date().getTime(),
        isBuyerMaker: true,
        isBestMatch: true,
      }));

      let called = 0;

      jest.spyOn(binanceClient, 'aggTrades').mockImplementation(async () => {
        if (called === 0) {
          called += 1;
          return Promise.resolve(expectedResult);
        }

        return Promise.resolve([]);
      });

      const result = await binanceService.getHistoricalMarketData({
        symbol,
        endTime,
        startTime,
      });

      expect(result).toStrictEqual(expectedResult);
      expect(binanceClient.aggTrades).toHaveBeenCalledTimes(2);
    });

    it('Should get additional data as long as there are 500 elements returned', async () => {
      const partialResult = new Array(500).fill(null).map((_, i) => ({
        aggregatedTradeId: i,
        price: '1.0',
        quantity: '1.0',
        firstTradeId: i,
        lastTradeId: i,
        timestamp: new Date().getTime(),
        isBuyerMaker: true,
        isBestMatch: true,
      }));

      let called = 0;

      jest.spyOn(binanceClient, 'aggTrades').mockImplementation(async () => {
        if (called < 10) {
          called += 1;
          return Promise.resolve(partialResult);
        }

        return Promise.resolve([]);
      });

      const expectedResult = new Array(10)
        .fill(null)
        .map(() => [...partialResult])
        .flat();

      const result = await binanceService.getHistoricalMarketData({
        symbol,
        endTime,
        startTime,
      });

      expect(result).toStrictEqual(expectedResult);
      expect(binanceClient.aggTrades).toHaveBeenCalledTimes(11);
    });
  });
});
