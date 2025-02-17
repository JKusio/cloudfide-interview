export enum PeriodType {
  INC = 'INC',
  DEC = 'DEC',
  STB = 'STB',
}

export type PeriodDto = {
  startPrice: string;
  endPrice: string;
  startTime: number;
  endTime: number;
  periodType: PeriodType;
};

export type AnalysisResultDto = {
  symbol: string;
  topPrice: string | null;
  lowestPrice: string | null;
  periods: Array<PeriodDto>;
};
