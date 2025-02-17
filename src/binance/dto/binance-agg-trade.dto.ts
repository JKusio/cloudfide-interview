export type BinanceAggTradeDto = {
  aggregatedTradeId: number;
  price: string;
  quantity: string;
  firstTradeId: number;
  lastTradeId: number;
  timestamp: number;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
};
