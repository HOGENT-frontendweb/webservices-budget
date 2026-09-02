import { IsOptional } from 'class-validator';
import { IsNumber } from 'nestjs-swagger-dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationQuery {
  @IsOptional()
  @ApiPropertyOptional()
  @IsNumber({ name: 'page', min: 1, default: 1 })
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @ApiPropertyOptional()
  @IsNumber({ name: 'pageSize', min: 1, default: 10 })
  @Type(() => Number)
  pageSize?: number = 10;
}
