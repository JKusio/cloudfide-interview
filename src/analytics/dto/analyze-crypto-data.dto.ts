import { IsDateString, IsString } from 'class-validator';

export class AnalyzeCryptoDataDto {
  @IsString()
  symbol: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
