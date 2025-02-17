import { Controller, Get, Query } from '@nestjs/common';
import { AnalyzeCryptoDataDto } from './dto/analyze-crypto-data.dto';
import { AnalyticsService } from './analytics.service';
import { AnalysisResultDto } from './dto/analysis-result.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  async analyzeCryptoData(
    @Query() params: AnalyzeCryptoDataDto,
  ): Promise<AnalysisResultDto> {
    const result = await this.analyticsService.analyzeCryptoData(params);

    return result;
  }
}
